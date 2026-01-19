import { BASE_URL } from "../config/constants";


export interface UploadFilesResponseSchema {
  count:number
  files: {
    file_id:string
    filename:string
    file_path:string
    size:number
  }[]
}

export async function uploadFiles(files:File[]) {
  const url = `${BASE_URL}api/upload`
  const formData = new FormData()
  files.forEach((file) => {
    console.log('Printing files details', {name:file.name, size:file.size})
    formData.append('files', file)
  })

  try {
    const response = await fetch(url, {
      method:"POST",
      body:formData
    })
    if (!response.ok) {
      throw new Error('Failed to upload files')
    }

    const data:UploadFilesResponseSchema = await response.json()
    return data
  } catch(error) {
    console.error('Failed to upload files', error)
    throw error
  }
}