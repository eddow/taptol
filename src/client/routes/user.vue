<template>
	<div class="user-route">
		<h1 v-if="userInfo" class="ui teal header">
			<div class="ui floating content">
				{{userInfo.name}}
			</div>
		</h1>
		<div v-if="userInfo && side === 'spec'">
			<h2 class="ui teal header">
				<div class="ui floating content">
					Services
				</div>
			</h2>
			<div class="ui middle aligned center aligned grid">
				<dyn-table :data="userInfo.services">
					<template v-slot:default="slotProps">
						<select-column :row="slotProps.row" prop="type" header="Type"
							:values="serviceTypes" />
						<text-column :row="slotProps.row" type="number"
							prop="rate" header="Rate $" />
						<text-column :row="slotProps.row" :multiLine="true"
							prop="description" header="Description" />
						<text-column :row="slotProps.row" type="time"
							prop="startHourTime" header="Start hour" />
						<text-column :row="slotProps.row" type="time"
							prop="endHourTime" header="End hour" />
						<edit-column :row="slotProps.row" :del="delService" :save="saveService"
							:create="createService"
							deletionTitle="Delete service"
							:deletionText="row=> `Are you sure you want to delete this service?`" />
					</template>
				</dyn-table>
			</div>
		</div>
		<div>
			<h2 class="ui teal header">
				<div class="ui floating content">
					Projects
				</div>
			</h2>
			<div class="ui middle aligned center aligned grid">
				<dyn-table :data="projects">
					<template v-slot:default="slotProps">
						<select-column :row="slotProps.row" :prop="peer" :header="peerHeader"
							:values="lookup" />
						<text-column :row="slotProps.row" :multiLine="true"
							prop="description" header="Description" />
						<select-column :row="slotProps.row" prop="stage" header="Stage"
							:values="stages" />
						<rating-column :row="slotProps.row"
							prop="rate" header="Rating" />
						<text-column :row="slotProps.row" :multiLine="true"
							prop="review" header="Review" />
						<edit-column :row="slotProps.row" :del="delProject" :save="saveProject"
							:create="createProject"
							deletionTitle="Delete project"
							:deletionText="row=> `Are you sure you want to delete this project?`" />
					</template>
				</dyn-table>
			</div>
		</div>
	</div>
</template>
<script lang="ts">
import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';
import Project from '@/biz/project';
import Service from '@/biz/service';
import {serviceTypes} from '@obj/service';
import {stages} from '@obj/project';
import UserAdmin from '@/biz/admin';
import * as table from '@/components/table';
import Specialist from '@/biz/specialist';

@Component({components: table})
export default class User extends Vue {
	static auth = 'adm';
	static params = ['side', 'user'];
	stages = stages;
	serviceTypes = serviceTypes;
	@Prop() side: 'cust' | 'spec';
	@Prop() user: string;
	userInfo: User = null;
	projects: Project[] = [];
	lookup: User[] = [];
	get peerHeader() {
		return 'cust'=== this.side?'Specialist':'Customer';
	}
	get peer() {
		return 'cust'=== this.side?'specialist':'customer';
	}
	async created() {
		var prjs = Project.usrList(this.side, this.user),
			user = 'cust'=== this.side?
				UserAdmin.get(this.user) :
				Specialist.get(this.user),
			peers = UserAdmin.lookup('cust'=== this.side?'spec':'cust');
		[this.projects, this.userInfo, this.lookup] = <any[]>await Promise.all([prjs, user, peers])
	}
	createService = ()=> { 
		let rv = new Service();
		rv.specialist = this.user;
		return rv;
	}
	delService = (id: any)=> {
		return Service.del(id);
	}
	saveService = (id: any, changes: any)=> {
		return id?Service.modify(id, changes):Service.create(changes);
	}
	createProject = ()=> { 
		let rv = new Project();
		rv['cust'=== this.side?'customer':'specialist'] = this.user;
		return rv;
	}
	delProject = (id: any)=> {
		return Project.del(id);
	}
	saveProject = (id: any, changes: any)=> {
		return Project.save(id, changes);
	}
}
</script>