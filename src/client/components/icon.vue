<template>
	<i v-if="2=== icons.length" class="icons">
		<i :class="[icons[0], 'icon']" />
		<i :class="[icons[1], 'bottom right corner icon']" />
	</i>
	<i v-else :class="[icons[0], 'icon']" />
</template>
<script lang="ts">
import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';

const concepts = {
	accept: ['check'],
	add: ['plus circle'],
	cancel: ['times'],
	delete: ['trash'],
	edit: ['pen'],
	email: ['envelope'],
	filter: ['filter'],
	login: ['user tie'],
	logout: ['door open'],
	password: ['lock'],
	project: ['clipboard list'],
	'project-prop': [/*'clipboard list',*/ 'question'],
	'project-ref': [/*'clipboard list',*/ 'times'],
	'project-cur': [/*'clipboard list',*/ 'spinner'],
	'project-done': [/*'clipboard list',*/ 'check'],
	'project-val': [/*'clipboard list',*/ 'check double'],
	register: ['user edit'],
	save: ['save'],
	specialist: ['user', 'tools'],
	service: ['tools'],
	user: ['user'],
	userCfg: ['user cog'],
	users: ['users']
}

@Component
export default class Icon extends Vue {
	@Prop() c: string
	get icons(): string[] {
		return concepts[this.c];
	}
}
</script>
