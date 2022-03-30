<template>
	<div v-if="reviewed">
		<h2 class="ui teal header">
			<div class="content">
				Review
			</div>
		</h2>
		<div class="ui relaxed divided list">
			<div class="item">
				<v-project :project="reviewed" />
			</div>
			<div class="item">
				<sform class="ui large form" :config="formConfig" @submit="submit" focus="review">
					<div class="ui stacked segment">
						<div class="field">
							<textarea name="review" v-model="review"></textarea>
						</div>
						<div class="field">
							<rating name="rate" v-model="rate" />
						</div>
						<button type="reset" :class="[
								'ui large button',
								submitting? 'disabled':''
							]" @click="reviewed = null">
							Cancel
						</button>
						<button type="submit" :class="[
								'ui large teal submit button',
								submitting? 'disabled':''
							]">
							Validate
						</button>
					</div>
					<div class="ui error message"></div>
				</sform>
			</div>
		</div>
	</div>
	<div v-else>
		<h2 class="ui teal header">
			<div class="content">
				Projects : {{stages[stage]}}
			</div>
		</h2>
		<h3 v-if="!projects" class="ui header">
			<div class="content">
				Loading...
			</div>
		</h3>
		<div v-else-if="projects.length" class="ui middle aligned center aligned grid">
			<projects
				:projects="projects"
				:canAccept="canAccept"
				:canFinish="canFinish"
				:canValidate="canValidate"
				:displayReview="stage === 'val'"
				@review="reviewProject"
			/>
		</div>
		<h3 v-else class="ui header">
			<div class="content">
				There's nothing to see here!
			</div>
		</h3>
	</div>
</template>
<script lang="ts">
import Vue from 'vue';
import {Component, Prop, Watch} from 'vue-property-decorator';
import Project from '@/biz/project';
import user from '@/biz/user';
import {Stage, stages, Stars} from '@obj/project';
import Projects from '@/components/projects.vue';
import VProject from '@/components/project.vue';

@Component({components: {Projects, VProject}})
export default class ServicesRoute extends Vue {
	static auth = ['spec', 'cust'];
	static params = ['stage'];
	stages = stages
	@Prop() stage: Stage
	get canAccept(): boolean { return 'spec'=== user.role && 'prop'=== this.stage; }
	get canFinish(): boolean { return 'spec'=== user.role && 'cur'=== this.stage; }
	get canValidate(): boolean { return 'cust'=== user.role && 'done'=== this.stage; }
	projects: Project[] = null
	@Watch('stage', {immediate: true})
	async loadProjects() {
		this.projects = null;
		this.projects = await Project.list(this.stage);
	}
	reviewed: Project = null;
	review: string = null;
	rate: Stars = null;
	reviewProject(p: Project) {
		this.review = '';
		this.rate = null;
		this.reviewed = p;
	}
	submitting: boolean = false;
	formConfig = {
		fields: {
			review: {
				identifier  : 'review',
				rules: [{
					type   : 'empty',
					prompt : 'Please enter a review'
				}, {
					type   : 'length[6]',
					prompt : 'Make sure to have an enhanced review'
				}]
			},
			rate: {
				identifier  : 'rate',
				rules: [{
					type   : 'empty',
					prompt : 'Please rate the project execution'
				}]
			}
		}
	};
	async submit() {
		this.submitting = true;
		try {
			await Project.review(this.reviewed._id, this.review, this.rate);
			this.projects.splice(this.projects.indexOf(this.reviewed), 1);
			this.reviewed = null;
		} finally {
			this.submitting = false;
		}
	}
}
</script>