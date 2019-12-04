export const buildDocVariable = doc => {
    return ({
        fragments: doc.items.reduce((acc, curr) => curr.items ? [...acc, ...curr.items] : [...acc, curr], []).map(item => ({
            type: item.type,
            text: item.text,
            data: item.data
        })),
        secondaryColumn: doc.items.reduce((acc, curr) => curr.items ? [...acc, ...curr.items] : [...acc, curr], []).map(item => ({
            type: item.type,
            text: item.text,
            data: item.data
        }))
    })
}