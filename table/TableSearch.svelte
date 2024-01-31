<script>
    import { getContext } from 'svelte';
    import { writable } from 'svelte/store';

    const rows = getContext('rows');
    const searchInput = writable('');

    let searchIcon;

    $: {
        let tempRows = $rows;
        for (let index in tempRows) {
            if (!(typeof tempRows[index] === 'object')) {
                continue;
            }
            const itemName = tempRows[index]['item']['name'];
            const input = $searchInput;
            if (itemName.toLowerCase().includes(input.toLowerCase())) {
                tempRows[index]['item']['visibleBySearch'] = 'yes';
            } else {
                tempRows[index]['item']['visibleBySearch'] = 'no';
            }
        }
        rows.set(tempRows);
    }
</script>

<div class="search-container">
    <input class="form-control bg-dark search-box" placeholder="Search..." bind:value={$searchInput} />
    <svg bind:this={searchIcon} class="search-box-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" aria-hidden="true">
        <path
            d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
            class="s-XmG9jZCKO2vW"
        />
    </svg>
</div>

<style>
    .search-box-icon {
        position: absolute;
        left: 11px;
        top: 12px;
        width: 0.8em;
        height: 0.8em;
        color: #c1c1c1;
    }
    .search-container {
        width: 100%;
        position: relative;
    }
    .search-box {
        width: 100%;
        margin-bottom: 8px;
        background-color: #2a3145 !important;
        padding-left: 2em;
        font-size: 1em;
    }
    .search-box:focus {
        border-color: var(--bs-border-color);
    }
</style>
