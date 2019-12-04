const filterHiddenItems = item => !item.hide;

const flatItems = (acc, curr) => {
    return curr.items ? [
        ...acc,
        ...curr.items.filter(filterHiddenItems)
    ] : [...acc, curr];
}

const prepareColumn = column => {
    return column.reduce(flatItems, []).map(item => ({
        type: item.type,
        text: item.text,
        data: item.data
    }));
}

export const buildDocVariable = (doc, options) => {
    return ({
        fragments: prepareColumn(doc.items),
        secondaryColumn: prepareColumn(doc.items),
        options: {
            stamp: options.stamp
        }
    });
}