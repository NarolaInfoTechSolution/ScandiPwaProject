<?php
namespace Magento\Catalog\Model\ResourceModel\Category\Collection;

/**
 * Interceptor class for @see \Magento\Catalog\Model\ResourceModel\Category\Collection
 */
class Interceptor extends \Magento\Catalog\Model\ResourceModel\Category\Collection implements \Magento\Framework\Interception\InterceptorInterface
{
    use \Magento\Framework\Interception\Interceptor;

    public function __construct(\Magento\Framework\Data\Collection\EntityFactory $entityFactory, \Psr\Log\LoggerInterface $logger, \Magento\Framework\Data\Collection\Db\FetchStrategyInterface $fetchStrategy, \Magento\Framework\Event\ManagerInterface $eventManager, \Magento\Eav\Model\Config $eavConfig, \Magento\Framework\App\ResourceConnection $resource, \Magento\Eav\Model\EntityFactory $eavEntityFactory, \Magento\Eav\Model\ResourceModel\Helper $resourceHelper, \Magento\Framework\Validator\UniversalFactory $universalFactory, \Magento\Store\Model\StoreManagerInterface $storeManager, ?\Magento\Framework\DB\Adapter\AdapterInterface $connection = null, ?\Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig = null)
    {
        $this->___init();
        parent::__construct($entityFactory, $logger, $fetchStrategy, $eventManager, $eavConfig, $resource, $eavEntityFactory, $resourceHelper, $universalFactory, $storeManager, $connection, $scopeConfig);
    }

    /**
     * {@inheritdoc}
     */
    public function addItem(\Magento\Framework\DataObject $object)
    {
        $pluginInfo = $this->pluginList->getNext($this->subjectType, 'addItem');
        if (!$pluginInfo) {
            return parent::addItem($object);
        } else {
            return $this->___callPlugins('addItem', func_get_args(), $pluginInfo);
        }
    }
}