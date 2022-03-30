<template>
	<div class="ui relaxed divided list">
		<div class="item" v-for="service in services" :key="service._id">
			<v-service :service="service">
				<router-link class="ui right floated primary button" v-if="edit"
					:to="{name: 'service', params: {svcId: service._id}}">
					<icon c="edit" />
					Edit
				</router-link>
				<button :class="[
					'ui right floated negative button',
					deleting? 'disabled':'']"
					v-if="edit"
					@click="deleteService(service._id)"
				>
					<icon c="delete" />
					Delete
				</button>
			</v-service>
		</div>
		<modal v-model="confirmDelete" title="Delete service" :del="true">
			Are you sure to delete this service and all its associated data ?
		</modal>
	</div>
</template>
<script lang="ts">
import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';
import Service from '@/biz/service';
import VService from './service.vue';

@Component({components: {VService}})
export default class Services extends Vue {
	@Prop() services: Service[];
	@Prop() edit: boolean;
	
	deleting: boolean = false
	confirmDelete: ()=> Promise<boolean> = null;
	async deleteService(svcId: string) {
		this.deleting = true;
		try {
			if(await this.confirmDelete()) {
				await Service.del(svcId);
				//delete localy
				this.services.splice(this.services.findIndex(s=> (<any>s)._id === svcId), 1);
			}
		} finally {
			this.deleting = false;
		}
	}
}
</script>