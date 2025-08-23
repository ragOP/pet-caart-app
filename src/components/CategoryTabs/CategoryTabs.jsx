import React from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, RefreshControl, ScrollView } from 'react-native';
import { TabView } from 'react-native-tab-view';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../../apis/getCategories';
import { EmptyState, EMPTY_STATE_CONFIGS } from '../EmptyState';
import CustomCategoryTabBar from './CustomCategoryTabBar';

const { width } = Dimensions.get('window');

const CategoryTabs = ({ renderScene }) => {
    const [index, setIndex] = React.useState(0);

    const { data: categoriesData = [], isLoading, error, refetch, isRefetching } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
        select: (data) => data.response?.data?.data?.categories,
    });

    const routes = React.useMemo(() => {
        if (categoriesData?.length === 0) return [];

        return categoriesData.map(category => ({
            key: category.slug,
            title: category.name.toUpperCase(),
            icon: category.image,
            category: category,
        }));
    }, [categoriesData]);

    const handleRefresh = React.useCallback(() => {
        refetch();
    }, [refetch]);

    // Create a wrapper for renderScene that includes refresh props
    const renderSceneWithRefresh = React.useCallback(({ route }) => {
        if (typeof renderScene === 'function') {
            return renderScene({
                route,
                onRefresh: handleRefresh,
                isRefreshing: isRefetching
            });
        }
        return null;
    }, [renderScene, handleRefresh, isRefetching]);

    if (isLoading) {
        return (
            <ScrollView
                contentContainerStyle={{ flex: 1 }}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching}
                        onRefresh={handleRefresh}
                        colors={['#F4A300']}
                        tintColor="#F4A300"
                    />
                }
            >
                <EmptyState
                    icon={EMPTY_STATE_CONFIGS.NO_CATEGORIES.icon}
                    title="Loading Categories..."
                    subtitle="Please wait while we fetch the latest categories for you."
                    iconColor="#F4A300"
                />
            </ScrollView>
        );
    }

    if (error) {
        return (
            <ScrollView
                contentContainerStyle={{ flex: 1 }}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching}
                        onRefresh={handleRefresh}
                        colors={['#F4A300']}
                        tintColor="#F4A300"
                    />
                }
            >
                <EmptyState
                    icon={EMPTY_STATE_CONFIGS.ERROR.icon}
                    title="Failed to Load Categories"
                    subtitle="We couldn't load the categories. Please check your connection and try again."
                    actionText="Retry"
                    onAction={handleRefresh}
                    isLoading={isRefetching}
                    iconColor="#FF6B6B"
                />
            </ScrollView>
        );
    }

    if (!routes.length) {
        return (
            <ScrollView
                contentContainerStyle={{ flex: 1 }}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching}
                        onRefresh={handleRefresh}
                        colors={['#F4A300']}
                        tintColor="#F4A300"
                    />
                }
            >
                <EmptyState
                    icon={EMPTY_STATE_CONFIGS.NO_CATEGORIES.icon}
                    title="No Categories Available"
                    subtitle="We couldn't find any categories at the moment. Please try again later."
                    actionText="Refresh"
                    onAction={handleRefresh}
                    isLoading={isRefetching}
                    iconColor="#AAB2BD"
                />
            </ScrollView>
        );
    }

    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderSceneWithRefresh}
            onIndexChange={setIndex}
            initialLayout={{ width }}
            renderTabBar={props => <CustomCategoryTabBar {...props} />}
            sceneContainerStyle={{ paddingTop: 0, marginTop: 0,flex: 1, backgroundColor: '#fff' }}
        />
    );
};

export default CategoryTabs; 