<template>
	<div id="app" :class="[desktop?'desktop':'mobile']" ref="root">
		<main-menu />
		<router-view class="article" />
	</div>
</template>
<style lang="scss">
.body {
	overflow: hidden;
}
#app {
	background-color: #dadada;
	height: 100vh;
}
/* user mgt */
.user-pass {
	height: 100%;
	.column {
		max-width: 450px;
	}
}
/* page content */
.article {
	flex: 1 1 auto;
	min-width: 0px;
	height: 100%;
}
#app.mobile .article {
	margin-top: 3.1em;
}
#app.mobile .article.grid {
	margin-top: 0;
}
#app.desktop .article {
	margin-left: 15rem;
}
.article .header .content {
	padding: 1em;
}
/* Data tables */
.ui.center.aligned > .ui {
	width: 90%;
	background-color: white;
	vertical-align: middle;
	align-self: center !important;
}
.multiline {
	white-space: pre-wrap;
}
</style>
<script lang="ts">
import Vue from 'vue';
import {Component, Watch, Provide, ProvideReactive} from 'vue-property-decorator';
import mainMenu from './mainMenu.vue';
import user from '@/biz/user';
import {globals} from '@/lib/ajax';

@Component({components: {mainMenu}})
export default class App extends Vue {
	@ProvideReactive() windowWidth: number = null;
	@ProvideReactive() get desktop(): boolean {
		return this.windowWidth >= 768;
	}
	@Provide() toast = (message: string, css: string, title?: string)=> {
		(<any>$(this.$refs.root)).toast({class: css, title, message});
	}
	constructor(...args: any[]) {
		super(...args);
		globals.failure.push((err: any)=> {
			(<any>$(this.$refs.root)).toast({	// semantic-ui.d.ts does not define `toast`
				class: 'error',
				title: err.statusText,
				message: err.responseText
			});
		});
		const grabWidth = ()=> { this.windowWidth = $(window).width(); };
		grabWidth();
		$(window).on('resize', grabWidth);
	}
	user = user
	@Watch('desktop', {immediate: true}) isDesktop(d: boolean) {
		user.desktop = d;
	}
	@Watch('user.role')
	goHome() {
		if(this.$route.path !== user.home)
			this.$router.push(user.home);
	}
}
</script>