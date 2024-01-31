<!--
<script>
    import { getContext } from 'svelte';

    const filterRows = getContext('filterRows');
    const rows = getContext('rows');
    const numberOfKeys = Object.keys(filterRows).length;
    let filters = {};

    for (let filter in filterRows[0].item) {
        if (filter == 'cost' || filter == 'icon' || filter == 'iconFolder' || filter == 'key' || filter == 'name' || filter == 'value') {
            continue;
        }
        filters[filter] = {};
    }

    for (let key in filterRows) {
        for (let filter in filters) {
            if (!(typeof filterRows[key].item === 'object')) {
                continue;
            }
            if (filterRows[key].item.hasOwnProperty(filter)) {
                const filterValue = filterRows[key].item[filter];
                const id = filterRows[key].item.key;
                if (Array.isArray(filters[filter][filterValue])) {
                    filters[filter][filterValue].push(id);
                } else {
                    filters[filter][filterValue] = [id];
                }
            }
        }
    }

    function isThereOnlyOneChoice(filter) {
        for (let choice in filter) {
            if (Object.keys(filter[choice]).length == numberOfKeys) {
                return true;
            }
        }
        return false;
    }
    for (let filter in filters) {
        if (!(typeof filters[filter] === 'object')) {
            continue;
        }
        const numberOfChoices = Object.keys(filters[filter]).length;
        if (isThereOnlyOneChoice(filters[filter]) || numberOfChoices == 0 || numberOfChoices == numberOfKeys) {
            delete filters[filter];
            continue;
        }
        filters[filter]['All'] = [];
        for (let index in filterRows) {
            if (!(typeof filterRows[index] === 'object')) {
                continue;
            }
            const key = filterRows[index].item['key'];
            filters[filter]['All'].push(key);
        }
    }

    const filterStates = {};
    for (let filter in filters) {
        filterStates[filter] = null;
    }

    function applyChanges(filter, choice) {
        if (choice === 'All') {
            clearFilter(filter);
        } else {
            applyFilter(filter, choice);
        }
    }

    function applyFilter(filter, choice) {
        filterStates[filter] = choice;
        updateVisibility($rows);
    }

    function clearFilter(filterName) {
        filterStates[filterName] = null;
        updateVisibility($rows);
    }

    function updateVisibility($rows) {
        let tempRows = $rows;
        for (let index in tempRows) {
            if (!(typeof tempRows[index] === 'object')) {
                continue;
            }
            let itemKey = tempRows[index]['item']['key'];
            let isVisible = true;
            for (let filterName in filterStates) {
                const selectedChoice = filterStates[filterName];
                if (selectedChoice && !itemMatchesFilter(itemKey, filterName, selectedChoice)) {
                    isVisible = false;
                    break;
                }
            }
            tempRows[index]['item']['visible'] = isVisible ? 'yes' : 'no';
        }
        rows.set(tempRows);
    }

    function itemMatchesFilter(key, filterName, choice) {
        if (filters[filterName][choice].includes(key)) {
            return true;
        } else {
            return false;
        }
    }
    console.log(filters);
</script>

<div class="filter-container">
    <ul class="nav nav-pills">
        {#each Object.keys(filters) as filter}
            {@const currentValue = filterStates[filter]}
            <li class="nav-item dropdown">
                <button class="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">{!currentValue ? filter : filter + ': ' + currentValue}</button>
                <ul class="dropdown-menu">
                    <li><button class="dropdown-item" on:click={() => clearFilter(filter)}>All</button></li>
                    {#each Object.keys(filters[filter]) as choice}
                        {#if choice !== 'All'}
                            <li><button class="dropdown-item" on:click={() => applyFilter(filter, choice)}>{choice}</button></li>
                        {/if}
                    {/each}
                </ul>
            </li>
        {/each}
    </ul>
</div>

<style>
    .filter-container {
        width: 100%;
    }
    .nav-pills {
        gap: 3px;
        margin-bottom: 2px;
    }
    .dropdown-item {
        background-color: #2a3145;
    }

    .dropdown-item:hover {
        background-color: #191c28;
    }
    .dropdown-item:active {
        background-color: #1e2230;
    }
    .nav-link {
        background-color: #2a3145;
        font-size: 11pt;
        padding: 6px 15px;
        color: #f1f1f1;
    }
    .dropdown-menu {
        background-color: #2a3145;
        /* border-radius: 5px; */
        /* padding-top: 2px;
      padding-bottom: 2px; */
    }
</style>
-->

<script>
    import { getContext } from 'svelte';
    export let filterBuilder;

    const rows = getContext('rows');
    const filterRows = getContext('filterRows');
    const numberOfKeys = Object.keys($rows).length;

    for (let filter in filterBuilder.filters) {
        filterBuilder.filters[filter].addFilterChoice(`All`, `All`);
        Object.keys($rows).forEach(function (key, index) {
            const choice = $rows[key].item[filter];
            filterBuilder.filters[filter].addFilterChoice(choice, choice);
        });
    }

    for (let key in $rows) {
        for (let filter in filterBuilder.filters) {
            if (!(typeof $rows[key].item === 'object')) {
                continue;
            }
            const id = $rows[key].item.key; 
            if ($rows[key].item.hasOwnProperty(filter)) {
                const filterChoice = $rows[key].item[filter]; 
                filterBuilder.filters[filter].filterChoices[filterChoice].keys[id] = id;
                filterBuilder.filters[filter].filterChoices[filterChoice].setVisible(true);
                if (!filterBuilder.filters[filter].visible) {
                    filterBuilder.filters[filter].setVisible(true);
                }
                if (Object.keys(filterBuilder.filters[filter].filterChoices[filterChoice].keys).length == numberOfKeys) {
                    filterBuilder.filters[filter].setVisible(false);
                }
            }
            filterBuilder.filters[filter].filterChoices['All'].keys[id] = id;
        }
    }

    const filterStates = {};
    for (let filter in filterBuilder.filters) {
        filterStates[filter] = null;
    }

    function applyFilter(filter, choice) {
        filterStates[filter] = choice;
        updateVisibility($rows);
    }

    function clearFilter(filterName) {
        filterStates[filterName] = null;
        updateVisibility($rows);
    }

    function updateVisibility($rows) {
        let tempRows = $rows;
        for (let index in tempRows) {
            if (!(typeof tempRows[index] === 'object')) {
                continue;
            }
            let itemKey = tempRows[index]['item']['key'];
            let isVisible = true;
            for (let filterName in filterStates) {
                const selectedChoice = filterStates[filterName];
                if (selectedChoice && !itemMatchesFilter(itemKey, filterName, selectedChoice)) {
                    isVisible = false;
                    break;
                }
            }
            tempRows[index]['item']['visible'] = isVisible ? 'yes' : 'no';
        }
        rows.set(tempRows);
    }

    function itemMatchesFilter(key, filterName, choice) {
        if (filterBuilder.filters[filterName].filterChoices[choice].keys[key]) {
            return true;
        } else {
            return false;
        }
    }
</script>

<div class="filter-container">
    <ul class="nav nav-pills">
        {#each Object.keys(filterBuilder.filters) as filter}
            {#if filterBuilder.filters[filter].visible}
                {@const currentValue = filterStates[filter] ? filterBuilder.filters[filter].filterChoices[filterStates[filter]].filterChoiceName : null}
                {@const filterName = filterBuilder.filters[filter].filterName}
                <li class="nav-item dropdown">
                    <button class="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">{!currentValue ? filterName : filterName + ': ' + currentValue}</button>
                    <ul class="dropdown-menu">
                        <li><button class="dropdown-item" on:click={() => clearFilter(filter)}>All</button></li>
                        {#each Object.keys(filterBuilder.filters[filter].filterChoices) as choice}
                            {@const choiceName = filterBuilder.filters[filter].filterChoices[choice].filterChoiceName}
                            {#if filterBuilder.filters[filter].filterChoices[choice].visible}
                                {#if choice !== 'All'}
                                    <li><button class="dropdown-item" on:click={() => applyFilter(filter, choice)}>{choiceName}</button></li>
                                {/if}
                            {/if}
                        {/each}
                    </ul>
                </li>
            {/if}
        {/each}
    </ul>
</div>

<style>
    .filter-container {
        width: 100%;
    }
    .nav-pills {
        gap: 3px;
        margin-bottom: 2px;
    }
    .dropdown-item {
        background-color: #2a3145;
    }

    .dropdown-item:hover {
        background-color: #191c28;
    }
    .dropdown-item:active {
        background-color: #1e2230;
    }
    .nav-link {
        background-color: #2a3145;
        font-size: 11pt;
        padding: 6px 15px;
        color: #f1f1f1;
    }
    .dropdown-menu {
        background-color: #2a3145;
        /* border-radius: 5px; */
        /* padding-top: 2px;
      padding-bottom: 2px; */
    }
</style>
