<script>
    import LinkSmall from '$comp/links/LinkSmall.svelte';
    import { getContext } from 'svelte';
    import { c } from 'svelte-highlight/languages';
    import { writable } from 'svelte/store';

    export let tableBuilder;

    const rows = getContext('rows');
    let visibleRowsCount = Object.keys($rows).length;

    $: {
        let count = 0;
        for (let index in $rows) {
            if (!(typeof $rows[index] === 'object')) {
                continue;
            }
            if ($rows[index]['item']['visible'] === 'yes' && $rows[index]['item']['visibleBySearch'] === 'yes') {
                count += 1;
            }
        }
        visibleRowsCount = count;
    }

    for (let index in tableBuilder.columns) {
        if (!(typeof tableBuilder.columns[index] === 'object')) {
            continue;
        }
        let column = tableBuilder.columns[index];
        let visible = false;
        for (let index in $rows) {
            if (!(typeof $rows[index] === 'object')) {
                continue;
            }
            if ($rows[index]['item']['visible'] === 'yes' && $rows[index]['item']['visibleBySearch'] === 'yes') {
                const columnData = column.dataSelector ? column.dataSelector($rows[index]['item']) : $rows[index]['item'][column.key];
                if (columnData != undefined) {
                    visible = true;
                    break;
                }
            }
        }
        column.visible = visible;
    }

    let sortableRows = writable([]);
    //itarate overrows and add to sortableRows(store) as an tuple  if row.item.visible === 'yes' && row.item.visibleBySearch === 'yes' key: item.key, value: all of the item object

    $: {
        let tempRows = $rows;
        let tempSortableRows = [];
        for (let index in tempRows) {
            if (!(typeof tempRows[index] === 'object')) {
                continue;
            }
            if (tempRows[index]['item']['visible'] === 'yes' && tempRows[index]['item']['visibleBySearch'] === 'yes') {
                tempSortableRows.push({
                    key: tempRows[index]['item']['key'],
                    value: tempRows[index]['item']
                });
            }
        }
        sortableRows.set(tempSortableRows);
    }

    let sortedColumnKey = null;
    let sortDirection = 1; // 1 for ascending, -1 for descending

    function sortRows(columnKey) {
        let tempSortableRows = [...$sortableRows];
        const column = tableBuilder.getColumn(columnKey);

        // Reverse sort direction if the same column is sorted again
        if (sortedColumnKey === columnKey) {
            sortDirection *= -1;
        } else {
            sortedColumnKey = columnKey;
            sortDirection = 1;
        }

        if (column.sortFunction) {
            tempSortableRows.sort((a, b) => sortDirection * column.sortFunction(a.value, b.value));
        } else {
            tempSortableRows.sort((a, b) => {
                const valueOfA = column.sortPropertySelector(a.value);
                const valueOfB = column.sortPropertySelector(b.value);
                if (valueOfA < valueOfB) {
                    return -1 * sortDirection;
                }
                if (valueOfA > valueOfB) {
                    return 1 * sortDirection;
                }
                return 0;
            });
        }
        sortableRows.set(tempSortableRows);
    }
</script>

<!--
<div>
    {#each $rows as row}
        {#if row.item.visible === 'yes' && row.item.visibleBySearch === 'yes'}
            <LinkSmall data={row.item} type="item" />
        {/if}
    {/each}
    {#if visibleRowsCount == 0}
        <div>Ooops... Nothing here...</div>
    {/if}
</div>
-->

<div>
    <table>
        <thead>
            <tr>
                {#each tableBuilder.columns as column}
                    {#if column.visible}
                        <th
                            >{column.name}
                            {#if column.sortable}
                                <button on:click={() => sortRows(column.key)}>Sort</button>
                            {/if}
                        </th>
                    {/if}
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each $sortableRows as row}
                <tr>
                    {#each tableBuilder.columns as column}
                        {#if column.visible}
                            {@const columnData = column.dataSelector ? column.dataSelector(row.value) : row.value[column.key]}
                            {#if columnData == undefined}
                                <td />
                            {:else if column.component}
                                <td><svelte:component this={column.component} {...columnData} /></td>
                            {:else}
                                <td>{@html columnData}</td>
                            {/if}
                        {/if}
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
    {#if visibleRowsCount == 0}
        <div>Ooops... Nothing here...</div>
    {/if}
</div>

<style>
    table {
        width: 100%;
    }
</style>
