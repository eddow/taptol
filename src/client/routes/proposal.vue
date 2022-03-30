<template>
	<div>
		<h2 class="ui teal header">
			<div class="ui floating content">
				Proposal
			</div>
		</h2>
		<div class="ui middle aligned center aligned grid">
			<div class="ui relaxed list" v-if="specialist">
				<router-link :to="{name: 'specialist', params: {spId: spId}}">
					<h1>{{specialist.name}}</h1>
				</router-link>
				<sform class="ui large form" :config="formConfig" @submit="submit" focus="description">
					<div class="ui stacked segment">
						<div class="field">
							<textarea name="description" v-model="description"></textarea>
						</div>
						<button type="submit" :class="[
								'ui fluid large teal submit button',
								submitting? 'disabled':''
							]">
							Send
						</button>
					</div>
					<div class="ui error message"></div>
				</sform>
			</div>
		</div>	
	</div>
</template>
<script lang="ts">
import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';
import Specialist from '@/biz/specialist';
import Project from '@/biz/project';

@Component
export default class Proposal extends Vue {
	static auth = ['cust'];
	static params = ['spId'];
	specialist: Specialist = null;
	submitting: boolean = false;
	@Prop() spId: string;
	description: string = '';
	async created() {
		this.specialist = await Specialist.get(this.spId);
	}
	formConfig = {
		fields: {
			description: {
				identifier  : 'description',
				rules: [{
					type   : 'empty',
					prompt : 'Please enter a description'
				}, {
					type   : 'length[6]',
					prompt : 'Make sure to have an enhanced description'
				}]
			}
		}
	};
	async submit() {
		this.submitting = true;
		try {
			await Project.post(this.spId, this.description);
			this.$router.push({name: 'specialists'});
		} finally {
			this.submitting = false;
		}
	}
}
</script>