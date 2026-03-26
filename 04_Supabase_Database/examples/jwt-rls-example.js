// JWT + RLS Example - KPRFlow Enterprise
// Demonstrating how JWT and RLS work together

import { createClient } from '@supabase/supabase-js';

// 1. JWT Authentication Example
async function authenticateUser(email, password) {
    const supabase = createClient(
        'https://ntlkmxuajqaoijjrxpqf.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    );

    // User signs in - JWT token is generated
    const { data, error } = await supabase.auth.signInWithPassword({
        email: 'marketing@kprflow.com',
        password: 'password123'
    });

    if (error) throw error;

    // JWT token contains user info
    const jwtToken = data.session.access_token;
    const user = data.user;

    console.log('JWT Token:', jwtToken);
    console.log('User Info:', {
        id: user.id,
        email: user.email,
        role: user.user_metadata?.role || 'CUSTOMER'
    });

    return { user, jwtToken };
}

// 2. RLS in Action - Different users see different data
async function demonstrateRLS() {
    // Marketing user can see all data
    const marketingClient = createClient(
        'https://ntlkmxuajqaoijjrxpqf.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        {
            global: {
                headers: {
                    Authorization: `Bearer ${marketingJwtToken}`
                }
            }
        }
    );

    // Customer user can only see their own data
    const customerClient = createClient(
        'https://ntlkmxuajqaoijjrxpqf.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        {
            global: {
                headers: {
                    Authorization: `Bearer ${customerJwtToken}`
                }
            }
        }
    );

    // Marketing sees ALL KPR dossiers
    const { data: marketingData } = await marketingClient
        .from('kpr_dossiers')
        .select('*');

    console.log('Marketing sees:', marketingData.length, 'dossiers');

    // Customer sees ONLY their own dossiers
    const { data: customerData } = await customerClient
        .from('kpr_dossiers')
        .select('*');

    console.log('Customer sees:', customerData.length, 'dossiers');
}

// 3. RLS Policy Examples
const rlsPolicies = `
-- Policy for Marketing role
CREATE POLICY "Marketing can view all dossiers" ON kpr_dossiers
    FOR SELECT USING (auth.jwt() ->> 'role' = 'MARKETING');

-- Policy for Customer role
CREATE POLICY "Customers can view own dossiers" ON kpr_dossiers
    FOR SELECT USING (
        auth.jwt() ->> 'role' = 'CUSTOMER' AND 
        customer_id = auth.uid()
    );

-- Policy for Finance role
CREATE POLICY "Finance can view financial data" ON kpr_dossiers
    FOR SELECT USING (
        auth.jwt() ->> 'role' = 'FINANCE' AND
        status IN ('SUBMITTED', 'UNDER_REVIEW', 'APPROVED')
    );
`;

// 4. JWT Token Structure Example
const jwtExample = {
    header: {
        alg: 'HS256',
        typ: 'JWT'
    },
    payload: {
        aud: 'authenticated',
        exp: 1734357696,
        sub: '12345678-1234-1234-1234-123456789012',
        email: 'marketing@kprflow.com',
        role: 'MARKETING',
        user_metadata: {
            name: 'John Doe',
            department: 'Marketing',
            permissions: ['read:all', 'write:marketing']
        },
        app_metadata: {
            provider: 'email',
            roles: ['marketing', 'user']
        }
    }
};

// 5. Security Benefits
const securityBenefits = {
    jwt: {
        authentication: '✅ Verifies user identity',
        stateless: '✅ No server-side session storage',
        portable: '✅ Works across services',
        expiration: '✅ Automatic token expiration',
        claims: '✅ Contains user permissions'
    },
    rls: {
        authorization: '✅ Controls data access per row',
        databaseLevel: '✅ Security at database layer',
        roleBased: '✅ Different access for different roles',
        granular: '✅ Precise control over data visibility',
        automatic: '✅ Applied automatically to all queries'
    }
};

// 6. Real-world Example in KPRFlow
async function kprFlowExample() {
    // Marketing user creates new KPR dossier
    const marketingClient = createClient(supabaseUrl, marketingToken);

    const newDossier = await marketingClient
        .from('kpr_dossiers')
        .insert({
            customer_id: 'customer-uuid',
            unit_property_id: 'unit-uuid',
            status: 'LEAD',
            assigned_to: auth.uid() // Current marketing user
        })
        .select();

    // Finance user can only see financial fields
    const financeClient = createClient(supabaseUrl, financeToken);

    const financialData = await financeClient
        .from('kpr_dossiers')
        .select('id, customer_id, plafon, status, created_at')
        .eq('status', 'SUBMITTED');

    // Customer user can only see their own dossier
    const customerClient = createClient(supabaseUrl, customerToken);

    const customerDossier = await customerClient
        .from('kpr_dossiers')
        .select('*')
        .eq('customer_id', auth.uid()); // Only their own data
}

export {
    authenticateUser,
    demonstrateRLS,
    jwtExample,
    securityBenefits,
    kprFlowExample
};
