<template>
	<div v-if="specialist">
		<h2 class="ui teal header">
			<router-link class="ui right floated primary icon button"
				:to="{name: 'proposal', params: {svcId: spId}}"
				v-if="isCustomer"
			>
				<icon c="add" />
				Request for a project
			</router-link>
			<div class="ui content">
				{{specialist.name}}
				<rating v-if="specialist.rating" :readonly="true" :value="specialist.rating" />
			</div>
		</h2>
		<div v-if="specialist.services.length">
			<h3 class="ui teal header">
				Services
			</h3>
			<div class="ui middle aligned center aligned grid">
				<services :edit="isAdmin" :services="specialist.services" />
			</div>
		</div>
		<div v-if="specialist.projects.length">
			<h3 class="ui teal header">
				Reviews
			</h3>
			<div class="ui middle aligned center aligned grid">
				<projects :projects="specialist.projects" :displayReview="true" />
			</div>
		</div>
	</div>
	<div v-else class="ui placeholder">
		<div class="full line"></div>
		<div class="very long line"></div>
		<div class="long line"></div>
		<div class="very long line"></div>
		<div class="long line"></div>
	</div>
</template>
<script lang="ts">
import Vue from 'vue';
import {Component, Inject, Model, Prop, Watch, Emit} from 'vue-property-decorator';
import user from '@/biz/user';
import Specialist from '@/biz/specialist';
import Services from '@/components/services.vue';
import Projects from '@/components/projects.vue';

@Component({components: {Services, Projects}})
export default class SpecialistView extends Vue {
	get isAdmin() { return 'adm'=== user.role; }
	get isCustomer() { return 'cust'=== user.role; }
	@Inject() toast: (message: string, css: string, title?: string)=> void;
	static auth = ['cust', 'spec', 'adm'];
	static params = ['spId'];
	specialist: Specialist = null;
	
	@Prop() spId: string;
	async created() {
		this.specialist = await Specialist.get(this.spId);
		if(!this.specialist) {
			this.$router.back();
			this.toast('Specialist inexistant', 'error')
		}
	}
}
</script>