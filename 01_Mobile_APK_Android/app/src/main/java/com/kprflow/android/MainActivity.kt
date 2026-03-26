package com.kprflow.android

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.kprflow.android.navigation.KprFlowNavigation
import com.kprflow.android.ui.theme.DesignSystemTheme
import com.kprflow.android.shared.FirebaseClient
import dagger.hilt.android.AndroidEntryPoint
import javax.inject.Inject

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    
    @Inject
    lateinit var firebaseClient: FirebaseClient
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        
        setContent {
            DesignSystemTheme {
                KprFlowApp()
            }
        }
    }
}

@Composable
fun KprFlowApp() {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route
    
    // Check if user is logged in
    var isLoggedIn by remember { mutableStateOf(false) }
    
    // TODO: Replace with actual Firebase Auth state listener
    isLoggedIn = true // For testing purposes
    
    Scaffold(
        modifier = Modifier.fillMaxSize()
    ) { paddingValues ->
        KprFlowNavigation(
            navController = navController,
            isLoggedIn = isLoggedIn,
            modifier = Modifier.padding(paddingValues)
        )
    }
}

@Preview(showBackground = true)
@Composable
fun KprFlowAppPreview() {
    DesignSystemTheme {
        KprFlowApp()
    }
}
