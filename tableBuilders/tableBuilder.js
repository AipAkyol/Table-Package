// this class uses the builder design pattern to create a table

export default class TableBuilder {
    constructor() {
        this.columns = [];
    }

    addColumn(columnKey, columnName) {
        const column = new Column(columnKey, columnName);
        this.columns.push(column);
        return column;
    }

    getColumn(columnKey) {
        return this.columns.find((c) => c.key === columnKey);
    }
}

class Column {
    constructor(columnKey, columnName) {
        this.name = columnName;
        this.key = columnKey;
        this.visible = true;
    }

    setVisible(visible) {
        this.visible = visible;
        return this;
    }

    setComponent(component) {
        this.component = component;
        return this;
    }

    setDataSelector(dataSelector) {
        this.dataSelector = dataSelector;
        return this;
    }

    setSortable(sortable) {
        this.sortable = sortable;
        return this;
    }

    setSortPropertySelector(sortPropertySelector) {
        this.sortPropertySelector = sortPropertySelector;
        return this;
    }

    setSortFunction(sortFunction) {
        this.sortFunction = sortFunction;
        return this;
    }
}
