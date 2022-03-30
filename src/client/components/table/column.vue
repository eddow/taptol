<template>
	<th v-if="row === 'header'">
		<slot name="header">
			<div>{{header}}</div>
		</slot>
	</th>
	<td v-else>
		<slot :edited="edited">
			<slot v-if="edited" name="edit" :edited="edited" />
			<slot v-else name="view" />
		</slot>
	</td>
</template>
<script lang="ts">
import Vue from 'vue';
import {Component, Prop, Inject} from 'vue-property-decorator';
import {MapWatch, WatchableMap} from '@/lib/watchable-map'
@Component
export default class Column extends Vue {
	@Prop() header: string;
	@Prop() row: any;
	@Inject() edition: WatchableMap<any, any>;
	editionWatch: MapWatch<any> = null;
	created() {
		this.editionWatch = this.edition.watcher(this.row);
	}
	get edited() {
		return this.editionWatch.value;
	}
}
</script>