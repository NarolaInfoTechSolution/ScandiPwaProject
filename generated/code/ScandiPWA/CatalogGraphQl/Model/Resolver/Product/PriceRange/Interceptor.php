<?php
namespace ScandiPWA\CatalogGraphQl\Model\Resolver\Product\PriceRange;

/**
 * Interceptor class for @see \ScandiPWA\CatalogGraphQl\Model\Resolver\Product\PriceRange
 */
class Interceptor extends \ScandiPWA\CatalogGraphQl\Model\Resolver\Product\PriceRange implements \Magento\Framework\Interception\InterceptorInterface
{
    use \Magento\Framework\Interception\Interceptor;

    public function __construct(\Magento\CatalogGraphQl\Model\Resolver\Product\Price\ProviderPool $priceProviderPool, \Magento\CatalogGraphQl\Model\Resolver\Product\Price\Discount $discount)
    {
        $this->___init();
        parent::__construct($priceProviderPool, $discount);
    }

    /**
     * {@inheritdoc}
     */
    public function resolve(\Magento\Framework\GraphQl\Config\Element\Field $field, $context, \Magento\Framework\GraphQl\Schema\Type\ResolveInfo $info, ?array $value = null, ?array $args = null)
    {
        $pluginInfo = $this->pluginList->getNext($this->subjectType, 'resolve');
        if (!$pluginInfo) {
            return parent::resolve($field, $context, $info, $value, $args);
        } else {
            return $this->___callPlugins('resolve', func_get_args(), $pluginInfo);
        }
    }
}
