package com.kprflow.android.navigation

import androidx.compose.foundation.layout.padding
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.vectorResource
import androidx.compose.ui.res.painterResource
import androidx.navigation.NavController
import androidx.navigation.NavHost
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.kprflow.android.R
import com.kprflow.android.screens.HomeScreen
import com.kprflow.android.screens.CustomerFormScreen
import com.kprflow.android.ui.theme.DesignSystemTheme

// Navigation Routes
sealed class Screen(val route: String, val title: String, val icon: Int) {
    object Home : Screen("home", "Home", R.drawable.ic_home)
    object Applications : Screen("applications", "Applications", R.drawable.ic_apps)
    object Create : Screen("create", "Create", R.drawable.ic_add)
    object Profile : Screen("profile", "Profile", R.drawable.ic_person)
    
    // Detail screens
    object ApplicationDetail : Screen("application_detail/{id}", "Detail", R.drawable.ic_details)
    object ApplicationCreate : Screen("application_create", "New Application", R.drawable.ic_add)
    object Login : Screen("login", "Login", R.drawable.ic_login)
}

@Composable
fun KprFlowNavigation(
    navController: NavHostController = rememberNavController(),
    isLoggedIn: Boolean = false,
    modifier: Modifier = Modifier
) {
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route
    
    DesignSystemTheme {
        if (isLoggedIn) {
            // Main app with bottom navigation
            Scaffold(
                modifier = modifier,
                bottomBar = {
                    BottomNavigationBar(
                        navController = navController,
                        currentRoute = currentRoute
                    )
                }
            ) { paddingValues ->
                NavHost(
                    navController = navController,
                    startDestination = Screen.Home.route,
                    modifier = Modifier.padding(paddingValues)
                ) {
                    // Main screens
                    composable(Screen.Home.route) {
                        HomeScreen(
                            onNavigateToApplications = { 
                                navController.navigate(Screen.Applications.route) 
                            },
                            onNavigateToCustomers = { 
                                navController.navigate(Screen.CustomerForm.route) 
                            },
                            onNavigateToReports = { 
                                // TODO: Navigate to reports
                            },
                            onNavigateToSettings = { 
                                navController.navigate(Screen.Profile.route) 
                            }
                        )
                    }
                    
                    composable(Screen.Applications.route) {
                        // TODO: ApplicationListScreen
                        Text("Applications Screen - Coming Soon!")
                    }
                    
                    composable(Screen.Create.route) {
                        // TODO: Quick create application
                        Text("Create Screen - Coming Soon!")
                    }
                    
                    composable(Screen.Profile.route) {
                        // TODO: ProfileScreen
                        Text("Profile Screen - Coming Soon!")
                    }
                    
                    // Detail screens
                    composable(Screen.ApplicationDetail.route) { backStackEntry ->
                        val applicationId = backStackEntry.arguments?.getString("id") ?: ""
                        // TODO: ApplicationDetailScreen
                        Text("Application Detail: $applicationId")
                    }
                    
                    composable(Screen.ApplicationCreate.route) {
                        // TODO: ApplicationCreateScreen
                        Text("Create Application Screen - Coming Soon!")
                    }
                    
                    composable(Screen.CustomerForm.route) {
                        CustomerFormScreen()
                    }
                }
            }
        } else {
            // Login screen
            NavHost(
                navController = navController,
                startDestination = Screen.Login.route,
                modifier = modifier
            ) {
                composable(Screen.Login.route) {
                    // TODO: LoginScreen
                    Text("Login Screen - Coming Soon!")
                }
            }
        }
    }
}

@Composable
fun BottomNavigationBar(
    navController: NavController,
    currentRoute: String?
) {
    val screens = listOf(
        Screen.Home,
        Screen.Applications,
        Screen.Create,
        Screen.Profile
    )
    
    NavigationBar {
        screens.forEach { screen ->
            NavigationBarItem(
                icon = { 
                    Icon(
                        painter = painterResource(id = screen.icon),
                        contentDescription = screen.title
                    )
                },
                label = { Text(screen.title) },
                selected = currentRoute == screen.route,
                onClick = {
                    navController.navigate(screen.route) {
                        // Pop up to the start destination of the graph to
                        // avoid building up a large stack of destinations
                        popUpTo(navController.graph.startDestinationId) {
                            saveState = true
                        }
                        // Avoid multiple copies of the same destination when
                        // reselecting the same item
                        launchSingleTop = true
                        // Restore state when reselecting a previously selected item
                        restoreState = true
                    }
                }
            )
        }
    }
}
