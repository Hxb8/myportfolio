<script lang="ts">
  import * as config from '$lib/config'
  import Toggle from './toggle.svelte'
</script>

<nav>
    <a>
        <b>{config.title}</b>
    </a>



    <ul class="links">
        <li>
            <a href="/rss.xml" target="_blank">RSS</a>

        </li>


    </ul>

    <Toggle />
</nav>

<style>

 nav {
     padding-block: var(--size-7);

 }
 .links {
     margin-block: var(--size-7);

 }

 a {
     color: inherit;
     text-decoration: none;
 }

 @media (min-width: 768px) {
     nav {
         display: flex;
         justify-content: space-between;
     }
     .links {
         display: flex;
         gap: var(--size-7);
         margin-block: 0;
     }
 }

</style>
