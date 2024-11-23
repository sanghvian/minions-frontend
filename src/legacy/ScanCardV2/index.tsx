import { FC, useState } from 'react';
import S3FileUpload from 'react-s3';
import { Upload, Button, message } from 'antd';
import { CameraFilled } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import { AppDispatch, RootState } from '@redux/store';
import { useDispatch, useSelector } from 'react-redux';
// import { setNumTries } from '@redux/features/userSlice';
import toast from 'react-hot-toast';
import { pushEvent } from '@utils/analytics';
import apiService from '@utils/api/api-service';
import { CompleteContact } from '@models/contact.model';
import { RecordType } from '@models/index';
import { setContact } from '@redux/features/contactSlice';
import { BottomSheetType, setBottomSheetType } from '@redux/features/activeEntitiesSlice';

// S3 Configuration
const config = {
    bucketName: process.env.REACT_APP_AWS_BUCKET_NAME,
    dirName: process.env.REACT_APP_S3_DIR_NAME, /* optional */
    region: process.env.REACT_APP_AWS_REGION_NAME,
    accessKeyId: process.env.REACT_APP_AWS_KEY,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET,
}

const ScanCardV2: FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { email: userId, token } = useSelector((state: RootState) => state.persisted.user.value)
    const uploadProps = {
        name: 'file',
        multiple: false,
        showUploadList: false,
        beforeUpload: async (file: File) => {
            // Generating a UUID and renaming the file before upload
            setIsLoading(true);
            const extension = file.name.split('.').pop() || '';
            const newName = `${uuidv4()}.${extension}`;
            const newFile = new File([file], newName, { type: file.type });

            toast.promise(
                new Promise(async (resolve, reject) => {
                    pushEvent('ClickUploadPhoto', {
                        // File size in MB
                        fileSize: file.size / (1024 ** 2)
                    })
                    const startTime = new Date().getTime();
                    try {
                        // Uploading the file to S3
                        const data = await S3FileUpload.uploadFile(newFile, config);
                        message.success(`File uploaded successfully. File is available at ${data.location}`);
                        const response: { name: string, companyName: string } = await apiService.imageSearch(data.location, userId, token);

                        if (!response.name || !response.companyName) {
                            throw new Error('Network response was not ok');
                        }

                        const newContact: CompleteContact = {
                            name: response.name,
                            biography: "",
                            namespace: "",
                            location: "",
                            noteIds: [],
                            notes: [],
                            recordType: RecordType.CONTACT,
                            timestamp: new Date().toISOString(),

                            // Empty fields
                            email: "",
                            phone: "",
                            interests: [],
                            occupation: "",
                            organization_name: response.companyName,
                            relationshipId: "",
                            imgUrl: data.location

                        }
                        dispatch(setContact(newContact))
                        // dispatch(setIsBottomSheetOpen(true))
                        dispatch(setBottomSheetType(BottomSheetType.CONTACT_ADD))
                        const endTime = new Date().getTime();
                        pushEvent('PhotoToContactCompleted', {
                            // File size in MB
                            fileSize: file.size / (1024 ** 2),
                            responseTime: (endTime - startTime) / 1000
                        })
                        // dispatch(setNumTries(numTries + 1));
                        // setIsLoading(true);
                        // Now 'text' contains the extracted text from the .txt file

                        resolve("Success"); // you can modify this to return relevant data if needed
                    } catch (error) {
                        message.error('File upload failed or text extraction failed');
                        console.error(error);
                        reject(error);
                    } finally {
                        setIsLoading(false);
                    }

                })
                , {
                    loading: 'Converting into contact',
                    success: <b>Contact Card saved!</b>,
                    error: <b>Could not save contact</b>,
                }
            )
            return false; // Return false to not automatically upload after select
        },
    };

    return (
        <Upload {...uploadProps}>
            <Button disabled={isLoading} icon={<CameraFilled />}>Capture Image</Button>
        </Upload>
    );
};

export default ScanCardV2;
