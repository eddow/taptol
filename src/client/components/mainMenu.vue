<template>
	<div :class="['ui fixed inverted main borderless',
		desktop && 'vertical',
		'main-menu menu']">
		<template v-if="user.role === 'anon'">
			<router-link to="/login" class="item">
				Login
				<icon c="login" />
			</router-link>
			<router-link to="/register" class="item">
				Register
				<icon c="register" />
			</router-link>
		</template>
		<template v-else>
			<div :class="['ui', (!desktop)&&'dropdown', 'item']">
				<div class="header">
					<icon c="user" />
					{{user.name}}
				</div>
				<div class="menu">
					<router-link to="/user-cfg" class="item">
						Configure
						<icon c="userCfg" />
					</router-link>
					<div class="item link" @click="user.logout()">
						Logout
						<icon c="logout" />
					</div>
				</div>
			</div>
			<div v-if="user.role === 'spec'" :class="['ui', (!desktop)&&'dropdown', 'item']">
				<div class="header">
					<icon c="specialist" />
					Specialist
				</div>
				<div class="menu">
					<router-link to="/services" class="item">
						Services
						<icon c="service" />
					</router-link>
				</div>
			</div>
			<div v-if="user.role === 'spec'" :class="['ui', (!desktop)&&'dropdown', 'item']">
				<div class="header">
					<icon c="project" />
					Projects
					<div v-if="!desktop && menuGlobal.status.prop" class="ui red label">
						{{menuGlobal.status.prop}}
					</div>
				</div>
				<div class="menu">
					<router-link :to="{name: 'projects', params: {stage: 'prop'}}" class="item">
						<icon c="project-prop" />
						Propositions
						<div v-if="menuGlobal.status.prop" class="ui red label">
							{{menuGlobal.status.prop}}
						</div>
					</router-link>
					<router-link :to="{name: 'projects', params: {stage: 'cur'}}" class="item">
						<icon c="project-cur" />
						In progress
						<div v-if="menuGlobal.status.cur" class="ui teal label">
							{{menuGlobal.status.cur}}
						</div>
					</router-link>
					<router-link :to="{name: 'projects', params: {stage: 'val'}}" class="item">
						<icon c="project-val" />
						History
						<div v-if="menuGlobal.status.val" class="ui label">
							{{menuGlobal.status.val}}
						</div>
					</router-link>
				</div>
			</div>
			<div v-if="user.role === 'cust'" :class="['ui', (!desktop)&&'dropdown', 'item']">
				<div class="header">
					<icon c="project" />
					Projects
					<div v-if="!desktop && menuGlobal.status.done" class="ui red label">
						{{menuGlobal.status.done}}
					</div>
				</div>
				<div class="menu">
					<router-link :to="{name: 'projects', params: {stage: 'ref'}}" class="item">
						<icon c="project-ref" />
						Refused
						<div v-if="menuGlobal.status.ref" class="ui label">
							{{menuGlobal.status.ref}}
						</div>
					</router-link>
					<router-link :to="{name: 'projects', params: {stage: 'cur'}}" class="item">
						<icon c="project-cur" />
						In progress
						<div v-if="menuGlobal.status.cur" class="ui teal label">
							{{menuGlobal.status.cur}}
						</div>
					</router-link>
					<router-link :to="{name: 'projects', params: {stage: 'done'}}" class="item">
						<icon c="project-done" />
						Finished
						<div v-if="menuGlobal.status.done" class="ui red label">
							{{menuGlobal.status.done}}
						</div>
					</router-link>
					<router-link :to="{name: 'projects', params: {stage: 'val'}}" class="item">
						<icon c="project-val" />
						History
						<div v-if="menuGlobal.status.val" class="ui label">
							{{menuGlobal.status.val}}
						</div>
					</router-link>
				</div>
			</div>
			<router-link to="/users" class="item" v-if="user.role === 'adm'">
				<icon c="users" />
				Users
			</router-link>
		</template>
		<router-link v-if="desktop || user.role !== 'spec'" :to="{name: 'specialists'}" class="item">
			<icon c="specialist" />
			Specialists
		</router-link>
	</div>
</template>
<style lang="scss">
#app.desktop .main-menu {
	height: 100%;
}
</style>
<script lang="ts">
import Vue from 'vue';
import user from '@/biz/user';
import {Component, InjectReactive, Watch} from 'vue-property-decorator';
import {globals} from '@/lib/ajax';
import {projectHeader} from '@obj/project';

globals.success.push((response: any, xhr: any)=> {
	let status = xhr.getResponseHeader(projectHeader.toLowerCase());
	if(status) menuGlobal.status = JSON.parse(status);
});

let menuGlobal = {
	status: {}
}

@Component
export default class Menu extends Vue {
	@InjectReactive() desktop: boolean;
	user = user;
	menuGlobal = menuGlobal;
	@Watch('user.role', {immediate: true})
	ddMenu() {
		if(!this.desktop) {
			Vue.nextTick(()=> {
				$('.main-menu .ui.dropdown').dropdown({});
			});
		}
	}
}
</script>