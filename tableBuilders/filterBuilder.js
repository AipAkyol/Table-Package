// this class uses the builder design pattern to create a filter bar

export default class FilterBuilder {
    constructor() {
        this.filters = {};
    }

    addFilter(filterKey, filterName) {
        const filter = new Filter(filterName);
        this.filters[filterKey] = filter;
        return filter;
    }
}

class Filter {
    constructor(filterName) {
        this.filterName = filterName;
        this.filterChoices = {};
        this.visible = false;
    }

    addFilterChoice(filterChoiceKey, filterChoiceName) {
        const filterChoice = new FilterChoice(filterChoiceName);
        this.filterChoices[filterChoiceKey] = filterChoice;
        return this;
    }

    setFilterChoices(filterChoices) {
        for (const filterChoiceKey of filterChoices) {
            //const filterChoiceName = filterChoices[filterChoiceKey];
            const filterChoiceName = filterChoiceKey;
            this.addFilterChoice(filterChoiceKey, filterChoiceName);
        }
        return this;
    }

    setVisible(visible) {
        if (visible) {
            this.visible = true;
        } else {
            this.visible = false;
        }
        return this;
    }
}

class FilterChoice {
    constructor(filterChoiceName) {
        this.filterChoiceName = filterChoiceName;
        this.keys = {};
        this.visible = false;
    }

    setVisible(visible) {
        if (visible) {
            this.visible = true;
        } else {
            this.visible = false;
        }
        return this;
    }
}
