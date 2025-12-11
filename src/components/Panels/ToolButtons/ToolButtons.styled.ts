import { styled } from 'core';
import Divider from '@/components/Elements/Divider/Divider';

export const ToolsDivider = styled(Divider, {
    marginInline: '$1',
    maxHeight: 'calc(100% - $2)'
});