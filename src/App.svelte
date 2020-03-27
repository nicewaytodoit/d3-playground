<script>
	import { Router, Link, Route } from 'svelte-routing';
	import Pie from './pages/pie-chart/pie.svelte';
	import Packman from './pages/packman-timer/packman.svelte';
	import Pomodoro from './pages/pomodoro-timer/pomodoro.svelte';
	import Africa from './pages/africa-tree-wall/africa.svelte';
	// import Africa1 from './pages/africa-tree-wall/africa1.svelte';
	import Home from './home.svelte';
	// export let name;
	export let url = ""; 
</script>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 3em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}

	nav {
		display: grid;
	}

	nav :global(a) {
		color: red !important;
	}
</style>

<main>
	<Router url="{url}">
		<div>
			<Route path="pie" component="{Pie}" />
			<Route path="packman" component="{Packman}" />
			<Route path="pomodoro" component="{Pomodoro}" />
			<Route path="/" >
				<h1>This is D3 Playgroud</h1>
				<nav>
					<!-- <Link class="lnk" to="/">Home</Link> -->
					<Link to="/pie">Pie Test</Link>
					<Link to="/packman">Packman Timer</Link>
					<Link to="/pomodoro">Pomodoro Timer</Link>
				</nav>
				<Africa />
			</Route>
		</div>
	</Router>
</main>

