<template>
	<column :row="row" :class="multiLine && 'multiLine'">
		<template v-slot:header>
			<div>{{header}}</div>
			<div class="ui fluid labeled input" v-if="hasFilter">
				<label for="amount" class="ui label"><icon c="filter" /></label>
				<input type="text" placeholder="Filter" v-model="syncedFilter">
			</div>
		</template>
		<template v-slot:edit="edition">
			<div class="ui fluid input">
				<textarea v-if="multiLine" v-model="edition.edited[prop]" :name="prop" />
				<input v-else :type="type" v-model="edition.edited[prop]" :name="prop" />
			</div>
		</template>
		<template v-slot:view>
			{{row[prop]}}
		</template>
	</column>
</template>
<script lang="ts">
import Vue from 'vue';
import {Component, Prop, Inject, PropSync} from 'vue-property-decorator';
import Column from './column.vue';

@Component({components: {Column}})
export default class TextColumn extends Vue {
	@Prop() header: string;
	@Prop() prop: string;
	@Prop() row: any;
	@Prop() multiLine: boolean;
	@Prop({default: 'text'}) type: string;
	@PropSync('filter') syncedFilter: string;

	get hasFilter() {
		return 'string'=== typeof this.syncedFilter;
	}
}
</script>