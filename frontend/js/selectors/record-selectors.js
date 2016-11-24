import { createSelector } from 'reselect';

const transliterations = state => state.getIn(['record', 'transliterations']);


export const useSFS4900RusTransliteration = createSelector([transliterations], (transliterations) => {
  return transliterations.get('sfs4900rus');
});

