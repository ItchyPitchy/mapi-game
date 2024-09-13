export const getDocumentElementById = (id: string) => {
	const element = document.getElementById(id)

	if (element === null) throw new Error(`Could not find element with id ${id}`)

	return element
}
