import datetime
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from typing import Dict, Any

class ResourceAllocator:
    def __init__(self):
        # Initialize with pre-trained model
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self._initialize_model()

    def _initialize_model(self):
        """Load or train the allocation model"""
        # Mock training data - in production this would come from historical DB records
        X_train = np.array([
            [1, 100, 3],  # [disaster_type, population, severity]
            [2, 50, 8],
            [3, 200, 5],
            [4, 150, 7],
            [1, 75, 5]
        ])
        y_train = np.array([
            [5, 20, 2],   # [medical_kits, food_packs, rescue_teams]
            [15, 30, 5],
            [8, 50, 3],
            [12, 45, 4],
            [7, 25, 3]
        ])
        self.model.fit(X_train, y_train)

    def calculate_allocation(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate optimal resource allocation"""
        try:
            # Validate input parameters
            if not all(k in params for k in ['disaster_type', 'population', 'severity']):
                raise ValueError("Missing required parameters")
            
            # Prepare input features
            features = np.array([
                params['disaster_type'],
                params['population'],
                params['severity']
            ]).reshape(1, -1)
            
            # Predict resources
            resources = self.model.predict(features)[0]
            
            return {
                'success': True,
                'allocation': {
                    'medical_kits': max(0, int(resources[0])),
                    'food_packs': max(0, int(resources[1])),
                    'rescue_teams': max(0, int(resources[2]))
                },
                'processed_at': datetime.datetime.now().isoformat()
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }

# Singleton service instance
resource_allocator = ResourceAllocator()