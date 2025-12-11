import type { PropsWithChildren } from 'react';
import * as Styled from './Loader.styled';

type Props = PropsWithChildren<{ fullScreen?: boolean | 'true'; filled?: boolean | 'true' }>;

const Loader = ({ children, ...restProps }: Props) => {
    return (
        <Styled.Container {...restProps} data-testid="loader">
            <Styled.InnerContainer>
                <Styled.Spinner name="spinner" size="md" />
                {children}
            </Styled.InnerContainer>
        </Styled.Container>
    );
};

export default Loader;