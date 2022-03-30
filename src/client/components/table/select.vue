<template>
	<column :row="row" :header="header" class="select-column">
		<template v-slot:edit="edition">
			<select v-model="edition.edited[prop]"
					class="ui fluid selection dropdown"
					:name="prop">
				<option v-for="(text, key) in values" :key="key"
					:value="key">{{text}}</option>
			</select>
		</template>
		<template v-slot:view>
			{{values[row[prop]]}}
		</template>
	</column>
</template>
<style lang="scss">
.select-column .ui.selection.dropdown {
	padding: 0.5em
}
</style>
<script lang="ts">
import Vue from 'vue';
import {Component, Prop, Inject} from 'vue-property-decorator';
import Column from './column.vue';

@Component({components: {Column}})
export default class TextColumn extends Vue {
	@Prop() header: string;
	@Prop() prop: string;
	@Prop() row: any;
	@Prop() values: Dictionary<string>;
}
</script>