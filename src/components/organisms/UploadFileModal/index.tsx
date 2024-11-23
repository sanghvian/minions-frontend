import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, Progress, Select, Spin } from "antd";
import { InboxOutlined, VideoCameraAddOutlined } from "@ant-design/icons";
import Dragger from "antd/es/upload/Dragger";
import toast from "react-hot-toast";
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from "uuid";
import { pushEvent } from "@utils/analytics";
import { BottomDrawerType, setActiveLanguage, setActiveVideoUrl, setBottomDrawerType, setFileUploadDuration, setIsBottomDrawerOpen, setIsModalOpen } from "@redux/features/activeEntitiesSlice";
import { addVideoToList, setActiveVideo } from "@redux/features/video";
import apiService from "@utils/api/api-service";
import { AppDispatch, RootState } from "@redux/store";
import { ActiveModalType } from "@redux/features/activeEntitiesSlice";
import { VideoLanguage, VideoProcessingStatus, VideoSource } from "@models/video.model";

const config = {
  bucketName: process.env.REACT_APP_AWS_BUCKET_NAME,
  dirName: "video-recordings", // optional
  region: process.env.REACT_APP_AWS_REGION_NAME,
  accessKeyId: process.env.REACT_APP_AWS_KEY,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET,
};

const UploadFileModal = () => {
  const dispatch = useDispatch();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // State to track upload progress
  const { isModalOpen, modalType } = useSelector((state: RootState) => state.activeEntities);
  const { email: userId, token } = useSelector((state: RootState) => state.persisted.user.value);
  const isVisible = isModalOpen && modalType === ActiveModalType.UPLOAD_AUDIO_VIDEO_FILE;
  const [uploadFileResponse, setUploadFileResponse] = useState<any>(null);
  const [file, setFile] = useState<any>(null); // File to upload
  const activeLanguage = useSelector((state: RootState) => state.activeEntities.activeLanguage);

  const onCancel = () => {
    dispatch(setIsModalOpen(false));
    setIsUploading(false); // Reset uploading state
    setUploadProgress(0); // Reset progress
  };

  const handleFileUpload = async (file: any, config: any) => {
    const startTime = new Date().getTime();
    const s3 = new AWS.S3({
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
      region: config.region,
      httpOptions: {
        timeout: 300000, // Set timeout to 5 minutes
      },
    });

    const fileName = `${uuidv4()}.${file.name.split('.').pop()}`;
    const params = {
      Bucket: config.bucketName,
      Key: `${config.dirName}/${fileName}`,
      Body: file,
    };

    return new Promise((resolve, reject) => {
      s3.upload(params)
        .on('httpUploadProgress', (evt) => {
          setUploadProgress(Math.round((evt.loaded / evt.total) * 100));
        })
        .send(async (err: any, data: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
            pushEvent('FileUploaded', { email: userId });
            const endTime = new Date().getTime();
            const uploadDuration = (endTime - startTime) / 1000;
            dispatch(setFileUploadDuration(uploadDuration));
          }
        });
    });
  };

  const uploadProps = {
    name: "file",
    multiple: false,
    showUploadList: false,
    beforeUpload: async (file: any) => {
      setIsUploading(true); // Start uploading
      setFile(file); // Set file to upload
      try {
        const data: any = await handleFileUpload(file, (config as any))
        setUploadFileResponse(data);
      } catch (error: any) {
        toast.error(`Upload failed: ${error.message}. Please email ankit@recontact.world for super-quick support on this ⚡️`);
        setIsUploading(false); // Reset uploading state on error
        setUploadProgress(0); // Reset progress on error
        dispatch(setIsModalOpen(false));
      }
      return false; // Prevent default upload
    },
  };

  const finishFileUpload = async() => {
    if (!activeLanguage) {
      toast.error("Please select a language to upload the video");
      return;
    }
    try {
      dispatch(setActiveVideoUrl(uploadFileResponse.Location));
      const createdVideoTranscriptObject = await apiService.createVideo(
        {
          videoUrl: uploadFileResponse.Location,
          transcriptText: "",
          userId,
          createdAt: new Date().toISOString(),
          name: file.name,
          language: activeLanguage,
          status: VideoProcessingStatus.PENDING,
          videoSource: VideoSource.USER_UPLOAD,
        },
        token
      );
      dispatch(setActiveVideo(createdVideoTranscriptObject));
      dispatch(addVideoToList(createdVideoTranscriptObject));
      dispatch(setIsModalOpen(false));
      toast.success("File uploaded successfully");
    }
    catch (error: any) {
      toast.error(
        `Upload failed: ${error.message}. Please email ankit@recontact.world for super-quick support on this ⚡️`
      );
      dispatch(setIsModalOpen(false));
    }
  }

  return (
    <Modal
      title="Upload File"
      visible={isVisible}
      onCancel={onCancel}
      footer={null}
      maskClosable={false}
    >
      {uploadFileResponse ? (
        <div style={{ padding: "10px 0px" }}>
          <p>Selected file: {file.name}</p>
          <Select
            placeholder="Select language"
            onChange={(value) => {
              dispatch(setActiveLanguage(value));
            }}
            style={{ width: "50%", marginRight: "1rem" }}
            options={[
              {
                value: VideoLanguage.ENGLISH,
                label: "English",
              },
              {
                value: VideoLanguage.HINDI,
                label: "Hindi",
              },
            ]}
          />
          <Button type="primary" onClick={finishFileUpload}>
            Finish
          </Button>
        </div>
      ) : (
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            <VideoCameraAddOutlined /> Supports single file upload.
          </p>
          {isUploading && (
            <div
              style={{
                width: "90%",
                height: "100%",
                padding: "1rem",
              }}
            >
              <Progress percent={uploadProgress} />
            </div>
          )}
        </Dragger>
      )}
    </Modal>
  );
};

export default UploadFileModal;
