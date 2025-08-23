import React from 'react';
import { StyleSheet, View, Platform, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const ContainerWrapper = ({ 
    children, 
    style, 
    backgroundColor = '#fff',
    edges = ['top', 'right', 'bottom', 'left'],
    ...props 
}) => {
    return (
        <SafeAreaView
            style={[
                styles.container,
                { backgroundColor },
                style
            ]}
            edges={edges}
            {...props}
        >
            {children}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default ContainerWrapper;