<template>
	<div class="specialists-route">
		<h2 class="ui teal header">
			<div class="ui floating content">
				Specialists
			</div>
		</h2>
		<div class="ui middle aligned center aligned grid">
			<div class="ui form">
				<div class="inline fields">
					<div class="four wide labeled field">
						<label class="ui label" for="serviceType"><icon c="service" /></label>
						<dropdown class="fluid" name="serviceType" :values="serviceTypes"
							v-model="serviceType" :clearable="true" />
					</div>
					<div class="one wide field">
						&nbsp;
					</div>
					<div class="two wide labeled field">
						<label class="ui label" for="rateMin">$</label>
						<input type="number" name="rateMin" v-model="rateMin" :min="0" :max="maxRate">
					</div>
					<div class="dash-separator">
					-
					</div>
					<div class="two wide labeled field">
						<label class="ui label" for="rateMax">$</label>
						<input type="number" name="rateMax" v-model="rateMax" :min="0" :max="maxRate">
					</div>
					<div class="one wide field">
						&nbsp;
					</div>
					<div class="two wide field">
						Minimum: <rating :clearable="true" v-model="minRating" />
					</div>
				</div>
			</div>
			<table class="ui celled table">
				<tbody>
					<tr class="item" v-for="specialist in filteredSpecialists" :key="specialist._id">
						<td class="content">
							<h2>
								<router-link :to="{name: 'specialist', params: {spId: specialist._id}}"
									v-if="isConnected">{{specialist.name}}</router-link>
								<template v-else>{{specialist.name}}</template>
							</h2>
							<span v-if="specialist.rating" class="ratings">
								<rating :readonly="true" :value="specialist.rating" />
							</span>
						</td>
						<td class="service-cell">
							<services class="description" :services="specialist.services"
								 :edit="isAdmin" />
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
<style lang="scss">
.specialists-route {
	.dash-separator {
		width: 1em;
	}
}
</style>
<script lang="ts">
import Vue from 'vue';
import {Component, Inject, Model, Prop, Watch, Emit} from 'vue-property-decorator';
import user from '@/biz/user';
import Specialist from '@/biz/specialist';
import Services from '@/components/services.vue';
import Service, {serviceTypes} from '@obj/service';

@Component({components: {Services}})
export default class Specialists extends Vue {
	get isAdmin() { return 'adm'=== user.role; }
	get isConnected() { return 'anon'!== user.role; }
	get isCustomer() { return 'cust'=== user.role; }
	specialists: Specialist[] = [];
	serviceTypes = serviceTypes
	serviceType: string = '';
	rateMin: number = 0;
	rateMax: number = 0;
	maxRate: number = null;
	minRating: number = 0;
	get filteredSpecialists() {
		type svcFilter = ((svc: Service)=> boolean);
		var rv = this.specialists,
			perSvc: svcFilter[] = [];

		if(this.serviceType) perSvc.push((svc: Service)=> svc.type === this.serviceType);
		if(this.rateMax) perSvc.push((svc: Service)=> svc.rate <= this.rateMax);
		if(this.rateMin) perSvc.push((svc: Service)=> svc.rate >= this.rateMin);
		if(perSvc.length)
			rv = rv.map((sp: Specialist)=> Object.assign({}, sp, {
				services: sp.services.filter(
					(svc: Service)=> perSvc.every((sf: svcFilter)=> sf(svc))
				)
			}));
		// We do it anyway as the server retrieves the service-less specialists
		rv = rv.filter((sp: Specialist)=> !!sp.services.length);
		if(this.minRating)
			rv = rv.filter((sp: Specialist)=> !sp.rating || sp.rating >= this.minRating);
		return rv;
	}
	async created() {
		this.specialists = await Specialist.list();
		let maxRate = 0;
		for(let sp of this.specialists)
			for(let svc of sp.services)
				if(svc.rate > maxRate)
					maxRate = svc.rate;
		this.rateMax = this.maxRate = maxRate;
	}
}
</script>