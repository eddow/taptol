<template>
	<table class="ui table">
		<thead>
			<tr>
				<slot row="header" />
			</tr>
		</thead>
		<tbody>
			<tr v-for="(row) in filteredData" :key="row[rkey]" class="ui form">
				<slot :row="row" />
			</tr>
		</tbody>
	</table>
</template>
<script lang="ts">
import Vue from 'vue';
import {Component, Prop, Provide, ProvideReactive} from 'vue-property-decorator';
import {WatchableMap} from '@/lib/watchable-map'

@Component
export default class DynTable extends Vue {
	@Prop()
	@ProvideReactive() data: any[];
	@Provide() edition: WatchableMap<any, any> = new WatchableMap<any, any>();	// row -> edit
	@Prop({default: '_id'})
	@Provide() rkey: string;
	@Prop() filter: (row: any)=> boolean;
	get filteredData() {
		return this.filter ?
			this.data.filter((row: any)=>
				this.edition.watcher(row).value || this.filter(row)
			) :
			this.data;
	}
}
</script>