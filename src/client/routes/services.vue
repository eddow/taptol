<template>
	<div>
		<h2 class="ui teal header">
			<router-link class="ui right floated primary icon button"
				:to="{name: 'service', params: {svcId: '+'}}">
				Add a service
				<icon c="add" />
			</router-link>
			<div class="content">
				Services
			</div>
		</h2>
		<h3 v-if="!services" class="ui header">
			<div class="content">
				Loading...
			</div>
		</h3>
		<div v-else-if="services.length" class="ui middle aligned center aligned grid">
			<services :edit="true" :services="services" />
		</div>
		<h3 v-else class="ui header">
			<div class="content">
				There is no proposed services.
				<router-link class="ui primary item"
					:to="{name: 'service', params: {svcId: '+'}}">
					Create the first one.
				</router-link>
			</div>
		</h3>
	</div>
</template>
<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator';
import Service from '@/biz/service';
import Services from '@/components/services.vue';

@Component({components: {Services}})
export default class ServicesRoute extends Vue {
	static auth = ['spec'];
	services: Service[] = null
	async created() {
		this.services = await Service.list();
	}
}
</script>