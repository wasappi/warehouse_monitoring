# -*- coding: utf-8 -*-
{
    'name': 'Warehouse Monitoring',
    'version': '1.0',
    'summary': 'Warehouse Monitoring Management',
    'category': 'IoT',
    'author': 'Lionel Bauwin',
    'license': 'LGPL-3',
    'depends': ['base', 'mail'],
    'installable': True,
    'application': True,
    'data': [
        'security/res_groups.xml',
        'security/ir.model.access.csv',
        # views
        'views/warehouse_monitoring_views.xml',
        'views/warehouse_monitoring_menus.xml',
        'demo/demo.xml'
    ],
    'demo': [
        'demo/demo.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'warehouse_monitoring/static/src/*.js', 
            'warehouse_monitoring/static/src/*.xml',
        ],
        'warehouse_monitoring.dashboard': [
            'warehouse_monitoring/static/src/dashboard/**/*',
        ]
    },
}
