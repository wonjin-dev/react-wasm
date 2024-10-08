#include <emscripten/emscripten.h>
#include <stdlib.h>

EMSCRIPTEN_KEEPALIVE float *matrixMultiply(float *arg1, float *arg2, float *result, int length)
{
    for (int i = 0; i < length * length; i++)
    {
        result[i] = 0;
    }
    for (int i = 0; i < length; i++)
    {
        for (int j = 0; j < length; j++)
        {
            for (int k = 0; k < length; k++)
            {
                result[i * length + j] += (arg1[i * length + k] * arg2[k * length + j]);
            }
        }
    }

    return (result);
}