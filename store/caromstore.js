export const state = () => ({
    enabled:false
});
export const mutations = {
    toggle(state){
        state.enabled = !state.enabled;
    }
};