<template>
	<column :row="row" :header="header">
		<template v-slot:edit="edition">
			<rating :readonly="false" v-model="edition.edited[prop]" :name="prop" :clearable="true" />
		</template>
		<template v-slot:view>
			<rating :readonly="true" :value="row[prop]" :clearable="true" />
		</template>
	</column>
</template>
<script lang="ts">
import Vue from 'vue';
import {Component, Prop, Inject} from 'vue-property-decorator';
import Column from './column.vue';

@Component({components: {Column}})
export default class RatingColumn extends Vue {
	@Prop() header: string;
	@Prop() prop: string;
	@Prop() row: any;
}
</script>