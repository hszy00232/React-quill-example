import { useRef, useMemo } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

export default function Editor() {
	const customImageHandler = () => {
		let QuillRefs: any = useRef(null)
		const PublicServices = {
			getUrl: async (fileName: string) => {
				return await fetch(`/api/public?fileName=${fileName}`).then(res => res.json())
			},
		}
		const input: any = document.createElement('input')
		input.setAttribute('type', 'file')
		input.setAttribute('accept', 'image/*')
		input.click()
		input.onchange = async () => {
			const file = input.files[0]
			const formData = new FormData()
			formData.append(file?.name, file)
			const faceUrlResult: any = await PublicServices.getUrl(encodeURIComponent(file?.name))
			const noAuthUrl = faceUrlResult?.faceUrl?.split('?')[0]
			const result: any = { method: 'put', url: faceUrlResult?.faceUrl, data: file }
			fetch(result).then((res: any) => {
				if (res?.status === 200) {
					console.log('上传成功！')
					let quill = QuillRefs?.current?.getEditor()
					const cursorPosition = quill.getSelection().index
					quill.insertEmbed(cursorPosition, 'image', noAuthUrl)
					quill.setSelection(cursorPosition + 1)
				}
			})
		}
	}

	const modules = useMemo(
		() => ({
			toolbar: {
				container: [
					['bold', 'italic', 'underline', 'strike'],
					['blockquote', 'code-block'],
					[{ list: 'ordered' }, { list: 'bullet' }],
					[{ script: 'sub' }, { script: 'super' }],
					[{ indent: '-1' }, { indent: '+1' }],
					[{ direction: 'rtl' }],
					[{ size: ['small', false, 'large', 'huge'] }],
					[{ header: [1, 2, 3, 4, 5, 6, false] }],
					[{ color: [] }, { background: [] }],
					[{ font: [] }],
					[{ align: [] }],
					['clean'],
					['link', 'image', 'video'],
				],
				handlers: {
					image: () => {
						customImageHandler.call(this)
					},
				},
			},
		}),
		[],
	)
	return (
		<>
			<ReactQuill modules={modules} placeholder="请输入" theme="snow" />
		</>
	)
}
