<template>
	<div class="content project-ctl">
		<div v-if="side === 'customer'" class="header">{{project.customer.name}}</div>
		<div v-else class="header">
			<router-link :to="{name: 'specialist', params: {spId: project.specialist._id}}">
				{{project.specialist.name}}
			</router-link>
		</div>
		<div class="description multiLine">{{project.description}}</div>
		<div class="extra">
			<slot />
		</div>
	</div>	
</template>
<style lang="scss">
.project-ctl {
	.rate {
		margin-right: 3em;
	}
	.description {
		border: 1px solid gray;
		padding: 1em;
	}
}
</style>
<script lang="ts">
import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';
import Project from '@/biz/project';

@Component
export default class ProjectView extends Vue {
	@Prop() project: Project;
	get side() {
		return 'object'=== typeof this.project.specialist ? 'specialist' : 'customer';
	}
	get otherName() {
		return this.project.specialist.name || this.project.customer.name
	}
}
</script>