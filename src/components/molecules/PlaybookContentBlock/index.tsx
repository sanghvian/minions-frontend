import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input } from 'antd'
import { TextArea } from 'antd-mobile'
import React from 'react'

interface PlaybookContentBlockI {
    field: any,
    form: any,
    index: number,
    remove: (index: number | number[]) => void
}

const PlaybookContentBlock: React.FC<PlaybookContentBlockI> = ({ field, form, index, remove }) => {

    const [activeResponseType, setActiveResponseType] = React.useState<'text' | 'number' | 'single-select' | 'multi-select'>(
        form.getFieldValue(['contentBlocks', index, 'responseType'] || 'text'))

    const handleChange = (event: any) => {
        // Update your state based on the selected option
        setActiveResponseType(event.target.value);
    };


    return (
        <div
            key={field.key}
            style={{
                display: 'flex',
                flexDirection: 'column',
                width: '92%',
                marginBottom: '12px',
                padding: '12px',
                borderRadius: 4,
                backgroundColor: '#f7f7f7',  //light grey
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                }}
            >
                <Form.Item
                    {...field}
                    name={[field.name, 'blockTitle']}
                    //   fieldKey={[field.fieldKey, 'blockTitle']}
                    fieldKey={['blockTitle']}
                    rules={[{ required: true, message: 'Missing block title' }]}
                >
                    <Input placeholder="Block Title" />
                </Form.Item>
                <Form.Item
                    {...field}
                    name={[field.name, 'responseType']}
                    fieldKey={[String(field.fieldKey), 'responseType']}
                    initialValue={'text'}
                    rules={[{ required: true, message: 'Please select a response type' }]}
                >
                    <select
                        defaultValue={'text'}
                        value={activeResponseType}
                        onChange={handleChange}
                    >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="single-select">Single Select</option>
                        <option value="multi-select">Multi Select</option>
                    </select>
                </Form.Item>
            </div>
            <Form.Item
                {...field}
                name={[field.name, 'description']}
                fieldKey={['description']}
                rules={[{ required: true, message: 'Missing block description' }]}
            >
                <TextArea placeholder="Block Description" />
            </Form.Item>


            {/* Conditional rendering for options based on responseType */}
            {(activeResponseType === "multi-select" || activeResponseType === "single-select") && (
                <Form.List name={[field.name, 'options']}>
                    {(optionFields, { add: addOption, remove: removeOption }) => (
                        <>
                            {optionFields.map(optionField => (
                                <div key={optionField.key}>
                                    <Form.Item
                                        {...optionField}
                                        name={[optionField.name, 'optionText']}
                                        fieldKey={[optionField.fieldKey!, 'optionText']}
                                        rules={[{ required: true, message: 'Missing option text' }]}
                                    >
                                        <Input placeholder="Option Text" />
                                    </Form.Item>
                                    <MinusCircleOutlined onClick={() => removeOption(optionField.name)} />
                                </div>
                            ))}
                            <Button type="dashed" onClick={() => addOption()} icon={<PlusOutlined />}>
                                Add Option
                            </Button>
                        </>
                    )}
                </Form.List>

            )}

            <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
            }}>
                <MinusCircleOutlined onClick={() => remove(field.name)} />
            </div>
        </div>
    )
}

export default PlaybookContentBlock
