<template>
	<div class="user-route">
		<h2 class="ui teal header">
			<div class="ui floating content">
				Users
			</div>
		</h2>
		<div class="ui middle aligned center aligned grid">
			<dyn-table :data="users" :filter="filter">
				<template v-slot:default="slotProps">
					<text-column :row="slotProps.row"
						prop="name" header="Name"
						:filter.sync="filters.name" />
					<text-column :row="slotProps.row"
						prop="email" header="E-mail"
						:filter.sync="filters.email" />
					<select-column :row="slotProps.row" prop="role" header="Role"
						:values="roles" />
					<edit-column :row="slotProps.row" :del="del" :save="save"
						:create="createUser"
						deletionTitle="Delete user"
						:deletionText="row=> `Are you sure you want to delete ${row.name}?`"
					>
						<router-link
							v-if="['spec','cust'].includes(slotProps.row.role) && slotProps.row._id"
							class="ui icon primary button"
							:to="{name: 'user', params: {side: slotProps.row.role, user: slotProps.row._id}}">
							<icon c="project" />
						</router-link>
						<button v-if="slotProps.row._id"
							class="ui icon orange button" @click="setPassword(slotProps.row)">
							<icon c="password" />
						</button>
					</edit-column>
				</template>
			</dyn-table>
			<modal v-model="changePassword" title="Set password">
				<div>
					Enter the new password for {{xpDetails.email}}.
				</div>
				<div class="ui fluid left icon input">
					<input type="text" placeholder="New password" v-model="xpDetails.value">
					<icon c="password" />
				</div>
			</modal>
		</div>
	</div>
</template>
<style lang="scss">
.user-route {
	td.command-column {
		text-align: center !important;
	}
}
</style>
<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator';
import UserAdmin from '@/biz/admin';
import User, {roles} from '@obj/user';
import * as table from '@/components/table';

@Component({components: table})
export default class Users extends Vue {
	static auth = 'adm';
	roles = roles
	users: User[] = [];
	filters = {
		name: '',
		email: ''
	};
	filter = (row: any)=> {
		return row.name.toLowerCase().includes(this.filters.name.toLowerCase()) &&
			row.email.toLowerCase().includes(this.filters.email.toLowerCase());
	}
	async created() {
		this.users = await UserAdmin.list();
	}
	del = async (id: any)=> {
		return UserAdmin.del(id);
	}
	save = async (id: any, changes: any)=> {
		return UserAdmin.save(id, changes);
	}
	createUser = ()=> {
		let rv = new User();
		Object.assign(rv, {name: '', email: ''});
		return rv;
	}
	changePassword: ()=> Promise<boolean> = null;
	xpDetails: any = {};
	async setPassword(row: User) {
		this.xpDetails = {
			email: row.email,
			value: ''
		};
		if(await this.changePassword())
			UserAdmin.changePassword(row._id, this.xpDetails.value);
	}
}
</script>