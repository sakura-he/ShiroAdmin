import { FunctionalComponent } from "vue";
import { NaTable } from ".";
import { NaTableProps } from "./type";
const useNaTable = () => {
    const NaTableRef = ref<InstanceType<typeof NaTable>>();
    const NaTableComponent: FunctionalComponent = (props: NaTableProps, context) => {
        
        return (
            <NaTable
                {...{ ...props, ...context.attrs }}
                ref={NaTableRef}
            >
                {{ ...context.slots }}
            </NaTable>
        );
    };
    return {NaTableComponent, NaTableRef};
};

export default useNaTable;
