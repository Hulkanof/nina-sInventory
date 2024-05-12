/**
 * Add a new data of a given type to the database
 * @param token The user token
 * @param type The type of data to add
 * @param data A csv file of data
 */
export default async function add(token: string, type: string, file: File) {

    console.log(file)

    var data = new FormData()
    data.append("type", type)
    data.append("file", file)

    const response = await fetch(`/api/v1/data`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: data
    })

    const responseData: BasicAPIResponse<any> = await response.json()
    if (responseData.type === "error") throw new Error(responseData.error)
    return responseData.data
}

