<template>
	<div class="ui relaxed divided list projects-ctl">
		<div class="item" v-for="project in projects" :key="project._id">
			<v-project :project="project">
				<button :class="[
					'ui right floated positive button',
					modifying? 'disabled':'']"
					v-if="canAccept"
					@click="accept(project, true)"
				>
					<icon c="accept" />
					Accept
				</button>
				<button :class="[
					'ui right floated negative button',
					modifying? 'disabled':'']"
					v-if="canAccept"
					@click="accept(project, false)"
				>
					<icon c="cancel" />
					Refuse
				</button>
				<button :class="[
					'ui right floated primary button',
					modifying? 'disabled':'']"
					v-if="canFinish"
					@click="finish(project, true)"
				>
					<icon c="accept" />
					Finished
				</button>
				<button :class="[
					'ui right floated positive button',
					modifying? 'disabled':'']"
					v-if="canValidate"
					@click="review(project)"
				>
					<icon c="accept" />
					Validate
				</button>
				<button :class="[
					'ui right floated negative button',
					modifying? 'disabled':'']"
					v-if="canValidate"
					@click="reopen(project)"
				>
					<icon c="cancel" />
					Re-open
				</button>
				<template v-if="displayReview">
					<rating :value="project.rate" :readonly="true" />
					<div class="review-text">
						{{project.review}}
					</div>
				</template>
			</v-project>
		</div>
		<modal v-model="confirm" :title="confirmation.title"
			:confirm="confirmation.button" :del="confirmation.suppression">
			{{confirmation.message}}
		</modal>
	</div>
</template>
<style lang="scss">
.projects-ctl {
	.review-text {
		display: inline-block;
	}
}
</style>
<script lang="ts">
import Vue from 'vue';
import {Component, Prop, Emit} from 'vue-property-decorator';
import Project from '@/biz/project';
import VProject from './project.vue';

@Component({components: {VProject}})
export default class Projects extends Vue {
	@Prop() projects: Project[];
	@Prop() canAccept: boolean;
	@Prop() canFinish: boolean;
	@Prop() canValidate: boolean;
	@Prop() displayReview: boolean;
	modifying: boolean = false;
	async modify<T>(project: Project, cb: ()=> Promise<T>) : Promise<T> {
		this.modifying = true;
		try {
			let rv = await cb();
			let ndx = this.projects.indexOf(project);
			console.assert(-1< ndx, 'Project exists');
			this.projects.splice(ndx, 1);
			return rv;
		} finally {
			this.modifying = false;
		}
	}
	confirmation = {
		title: '',
		message: '',
		button: '',
		suppression: null
	};
	confirm: ()=> Promise<boolean> = null;
	async accept(project: Project, value: boolean) {
		this.confirmation = value ? {
			title: 'Accept project',
			message: 'Begin working on the project now ?',
			button: 'Accept',
			suppression: false
		} : {
			title: 'Refuse project',
			message: 'Are you sure to refuse once for all this project ?',
			button: 'Refuse',
			suppression: true
		};
		if(await this.confirm())
			this.modify(project, async()=> { return await Project.accept(project._id, value); });
	}
	async finish(project: Project) {
		this.confirmation = {
			title: 'Finish project',
			message: 'Mark the project as finished ?',
			button: 'Finish',
			suppression: false
		}
		if(await this.confirm())
			this.modify(project, async()=> { return await Project.finish(project._id); });
	}
	async reopen(project: Project) {
		this.confirmation = {
			title: 'Re-open project',
			message: 'Mark back the project as in progress ?',
			button: 'Re-open',
			suppression: true
		};
		if(await this.confirm())
			this.modify(project, async()=> { return await Project.reopen(project._id); });
	}
	@Emit() review(project: Project) {}
}
</script>