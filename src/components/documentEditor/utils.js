const filterHiddenItems = item => !item.hide;

const flatItems = (acc, curr) => {
    return curr.items ? [
        ...acc,
        ...curr.items.filter(filterHiddenItems)
    ] : [...acc, curr];
}

const prepareColumn = (column, secondary) => {
    return column.reduce(flatItems, []).map(item => ({
        type: item.type,
        text: secondary? item.secondaryText : item.text,
        data: item.data,
        language: secondary? item.secondaryLanguage : item.language
    }));
}

export const buildDocVariable = (doc, options) => {
    return ({
        fragments: prepareColumn(doc.items),
        secondaryColumn: prepareColumn(doc.items, true),
        options: {
            stamp: options.stamp
        }
    });
}