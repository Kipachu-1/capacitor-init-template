package com.laleinn.app

import android.util.Log
import androidx.credentials.CredentialManager
import androidx.credentials.CustomCredential
import androidx.credentials.GetCredentialRequest
import androidx.credentials.exceptions.GetCredentialException
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import com.google.android.libraries.identity.googleid.GetGoogleIdOption
import com.google.android.libraries.identity.googleid.GoogleIdTokenCredential
import com.google.android.libraries.identity.googleid.GoogleIdTokenParsingException
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

@CapacitorPlugin(name = "GoogleAuth")
class GoogleAuthPlugin : Plugin() {

    @PluginMethod
    fun signIn(call: PluginCall) {
        // Get web client ID from plugin configuration or call parameters
        val webClientId = call.getString("webClientId")
            ?: call.reject("MISSING_CLIENT_ID", "Web client ID is required").toString()

        CoroutineScope(Dispatchers.IO).launch {
            try {
                val result = performSignIn(webClientId)
                withContext(Dispatchers.Main) {
                    call.resolve(result)
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    call.reject("SIGN_IN_FAILED", e.message, e)
                }
            }
        }
    }

    private suspend fun performSignIn(webClientId: String): JSObject {
        val googleIdOption: GetGoogleIdOption = GetGoogleIdOption.Builder()
            .setFilterByAuthorizedAccounts(true)
            .setFilterByAuthorizedAccounts(false)
            .setServerClientId(webClientId)
            .setAutoSelectEnabled(false)
            .build()

        val request = GetCredentialRequest.Builder()
            .addCredentialOption(googleIdOption)
            .build()

        val credentialManager = CredentialManager.create(context)

        try {
            val result = credentialManager.getCredential(context, request)
            return handleSignIn(result)
        } catch (e: GetCredentialException) {
            Log.e("GoogleAuthPlugin", "GetCredentialException", e)
            throw Exception("Failed to get credentials: ${e.message}")
        }
    }

    private fun handleSignIn(result: androidx.credentials.GetCredentialResponse): JSObject {
        val response = JSObject()

        when (val credential = result.credential) {
            is CustomCredential -> {
                if (credential.type == GoogleIdTokenCredential.TYPE_GOOGLE_ID_TOKEN_CREDENTIAL) {
                    try {
                        val googleIdTokenCredential =
                            GoogleIdTokenCredential.createFrom(credential.data)

                        // Create response object with user data
                        response.put("success", true)
                        response.put("idToken", googleIdTokenCredential.idToken)
                        response.put("displayName", googleIdTokenCredential.displayName)
                        response.put("familyName", googleIdTokenCredential.familyName)
                        response.put("givenName", googleIdTokenCredential.givenName)
                        response.put("id", googleIdTokenCredential.id)
                        response.put(
                            "profilePictureUri",
                            googleIdTokenCredential.profilePictureUri?.toString()
                        )

                        Log.d(
                            "GoogleAuthPlugin",
                            "Sign in successful for user: ${googleIdTokenCredential.displayName}"
                        )

                    } catch (e: GoogleIdTokenParsingException) {
                        Log.e("GoogleAuthPlugin", "Failed to parse Google ID token", e)
                        throw Exception("Failed to parse Google ID token: ${e.message}")
                    }
                } else {
                    Log.e("GoogleAuthPlugin", "Unexpected credential type: ${credential.type}")
                    throw Exception("Unexpected credential type")
                }
            }

            else -> {
                Log.e("GoogleAuthPlugin", "Unexpected credential type")
                throw Exception("Unexpected credential type")
            }
        }

        return response
    }

    @PluginMethod
    fun signOut(call: PluginCall) {
        // For Google Sign-In, you typically just clear local state
        // The actual sign-out from Google services should be handled on the frontend
        try {
            // Clear any local authentication state if needed
            val response = JSObject()
            response.put("success", true)
            call.resolve(response)
        } catch (e: Exception) {
            call.reject("SIGN_OUT_FAILED", e.message, e)
        }
    }


    @PluginMethod
    fun isAvailable(call: PluginCall) {
        try {
            val credentialManager = CredentialManager.create(context)
            val response = JSObject()
            response.put("available", true)
            call.resolve(response)
        } catch (e: Exception) {
            val response = JSObject()
            response.put("available", false)
            response.put("error", e.message)
            call.resolve(response)
        }
    }
}

