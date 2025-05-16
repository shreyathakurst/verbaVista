"use client"

import { useRef } from "react"
import { Editor } from "@tinymce/tinymce-react"

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const editorRef = useRef(null)

  const handleEditorChange = (content) => {
    onChange(content)
  }

  return (
    <Editor
      apiKey="0144sdm8ru3dsy8pqq43lw2v9hq2q072k5xy8dvvrwtx052e" 
      onInit={(evt, editor) => (editorRef.current = editor)}
      value={value}
      init={{
        height: 500,
        menubar: false,
        plugins: [
          "advlist autolink lists link image charmap print preview anchor",
          "searchreplace visualblocks code fullscreen",
          "insertdatetime media table paste code help wordcount",
        ],
        toolbar:
          "undo redo | formatselect | bold italic backcolor | \
          alignleft aligncenter alignright alignjustify | \
          bullist numlist outdent indent | removeformat | help | image",
        content_style:
          "body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px }",
        placeholder: placeholder || "Write your content here...",
        images_upload_handler: async (blobInfo, progress) => {
          try {
            const formData = new FormData()
            formData.append("image", blobInfo.blob(), blobInfo.filename())

            const response = await fetch("http://localhost:3000/api/upload", {
              method: "POST",
              body: formData,
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            })

            if (!response.ok) {
              throw new Error("Upload failed")
            }

            const data = await response.json()
            return data.imageUrl
          } catch (error) {
            console.error("Image upload error:", error)
            return ""
          }
        },
      }}
      onEditorChange={handleEditorChange}
    />
  )
}

export default RichTextEditor
