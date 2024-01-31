<script>
    import { setContext } from 'svelte';
    import { writable } from 'svelte/store';
    export let rows;

    const rowsStore = writable(rows);
    let rowsPlusVisibility = {}
    rowsStore.subscribe((data) => {
        rowsPlusVisibility = data;
    })
    for (let key in rowsPlusVisibility) {
        if (!(typeof(rowsPlusVisibility[key].item) === "object")){
            continue;
        }
        rowsPlusVisibility[key].item["visible"] = "yes";
        rowsPlusVisibility[key].item["visibleBySearch"] = "yes";
    }
    rowsStore.set(rowsPlusVisibility)
    const denemeStore = writable({"deneme" : 1})
    setContext('deneme',denemeStore)
    setContext('rows', rowsStore);
    setContext('filterRows', rows);
</script>

<slot>hey</slot>
