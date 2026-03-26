package com.kprflow.android.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.kprflow.android.R

@Composable
fun CustomerFormScreen(
    onSaveCustomer: (CustomerData) -> Unit = {},
    onCancel: () -> Unit = {}
) {
    var customerName by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var phone by remember { mutableStateOf("") }
    var address by remember { mutableStateOf("") }
    
    val scrollState = rememberScrollState()
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
            .verticalScroll(scrollState)
    ) {
        // Customer Name
        Text(
            text = stringResource(R.string.customer_name),
            fontSize = 16.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(vertical = 8.dp)
        )
        
        OutlinedTextField(
            value = customerName,
            onValueChange = { customerName = it },
            label = { Text(stringResource(R.string.enter_customer_name)) },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Text),
            modifier = Modifier.fillMaxWidth()
        )
        
        Spacer(modifier = Modifier.height(16.dp))
        
        // Email
        Text(
            text = stringResource(R.string.email),
            fontSize = 16.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(vertical = 8.dp)
        )
        
        OutlinedTextField(
            value = email,
            onValueChange = { email = it },
            label = { Text(stringResource(R.string.enter_email)) },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
            modifier = Modifier.fillMaxWidth()
        )
        
        Spacer(modifier = Modifier.height(16.dp))
        
        // Phone
        Text(
            text = stringResource(R.string.phone_number),
            fontSize = 16.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(vertical = 8.dp)
        )
        
        OutlinedTextField(
            value = phone,
            onValueChange = { phone = it },
            label = { Text(stringResource(R.string.enter_phone)) },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
            modifier = Modifier.fillMaxWidth()
        )
        
        Spacer(modifier = Modifier.height(16.dp))
        
        // Address
        Text(
            text = stringResource(R.string.address),
            fontSize = 16.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(vertical = 8.dp)
        )
        
        OutlinedTextField(
            value = address,
            onValueChange = { address = it },
            label = { Text(stringResource(R.string.enter_address)) },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Text),
            modifier = Modifier.fillMaxWidth()
        )
        
        Spacer(modifier = Modifier.height(32.dp))
        
        // Action Buttons
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            OutlinedButton(
                onClick = onCancel,
                modifier = Modifier.weight(1f)
            ) {
                Text(stringResource(R.string.cancel))
            }
            
            Button(
                onClick = {
                    val customerData = CustomerData(
                        name = customerName,
                        email = email,
                        phone = phone,
                        address = address
                    )
                    onSaveCustomer(customerData)
                },
                modifier = Modifier.weight(1f)
            ) {
                Text(stringResource(R.string.save_customer))
            }
        }
    }
}

data class CustomerData(
    val name: String,
    val email: String,
    val phone: String,
    val address: String
)
