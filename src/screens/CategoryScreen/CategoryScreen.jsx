import React from 'react';
import SafeAreaWrapper from '../../components/SafeAreaWrapper';
import CategoryTabs from '../../components/CategoryTabs/CategoryTabs';
import CategoryContent from '../../components/CategoryContent/CategoryContent';

const CategoryScreen = () => {
  const renderScene = ({ route, onRefresh, isRefreshing }) => {
    return (
      <CategoryContent 
        route={route} 
        onRefresh={onRefresh}
        isRefreshing={isRefreshing}
      />
    );
  };

  return (
    <SafeAreaWrapper style={{ backgroundColor: '#fff' }}>
      <CategoryTabs renderScene={renderScene} />
    </SafeAreaWrapper>
  );
};

export default CategoryScreen;
